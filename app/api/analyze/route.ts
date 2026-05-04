import Groq from 'groq-sdk';
import { extractText, getDocumentProxy } from 'unpdf';
import { NextRequest, NextResponse } from 'next/server';
import { NewsItem } from '@/types';

const SYSTEM_PROMPT = `You are an expert interview coach and career advisor. Analyze the provided CV/resume and job description carefully, then generate comprehensive interview preparation material.

Return ONLY a valid JSON object with this exact structure:
{
  "match": {
    "score": <integer 0-100>,
    "level": <"Perfect" | "Strong" | "Good" | "Partial" | "Weak">,
    "summary": "<2-3 sentences explaining the overall match>",
    "strengths": ["<specific strength from CV that matches JD>", "<strength 2>", "<strength 3>"],
    "gaps": ["<gap or missing requirement>", "<gap 2>"]
  },
  "role": {
    "title": "<exact job title from JD>",
    "company": "<company name from JD>"
  },
  "companySnapshot": {
    "overview": "<2-3 sentences: what the company does, market position>",
    "businessModel": "<how they make money, key revenue drivers>",
    "culture": "<values, working style, what they care about>"
  },
  "whatTheyReallyWant": {
    "summary": "<1-2 sentences cutting through the jargon — what is this role actually about?>",
    "topPriorities": ["<the #1 thing they actually need from this hire>", "<priority 2>", "<priority 3>"],
    "cultureSignals": ["<what the JD language reveals about the team or culture>", "<signal 2>"],
    "redFlags": ["<a potential challenge, pressure, or concern hidden in the JD>"]
  },
  "whyThisCompany": [
    "<specific, genuine reason tailored to this company and role>",
    "<reason 2>",
    "<reason 3>"
  ],
  "whyYou": [
    "<specific reason backed by CV experience that matches this JD>",
    "<reason 2>",
    "<reason 3>",
    "<reason 4>"
  ],
  "talkingPoints": [
    "<key thing to emphasize in the interview, specific to this role>",
    "<point 2>",
    "<point 3>",
    "<point 4>",
    "<point 5>"
  ],
  "questionsToAsk": [
    "<thoughtful question that shows strategic thinking>",
    "<question 2>",
    "<question 3>",
    "<question 4>",
    "<question 5>"
  ],
  "elevatorPitch": "<2-3 sentence 'tell me about yourself' answer tailored to this exact role. Start from the candidate's most relevant background, connect it to what this company needs, and end with why this role is the natural next step. First person, confident, specific.>"
}

Match level guide — be strict:
- Perfect (96-100): Truly exceptional fit. Every key requirement is met, including nice-to-haves. ZERO notable gaps. Do not assign Perfect if you list any gap items.
- Strong (80-95): Strong fit — most key requirements match. Any gaps are minor and easily addressed in conversation.
- Good (60-79): Solid fit — core requirements match but there are clear gaps worth preparing to discuss.
- Partial (40-59): Some requirements match but significant gaps exist.
- Weak (0-39): Few requirements match. Major gaps throughout.

Rules:
- If you list ANY gap items, the level must be Strong or lower — never Perfect.
- Be specific — reference actual experiences from the CV and actual requirements from the JD.
- "whatTheyReallyWant" should cut through corporate language and say what's really being asked.
- redFlags should surface real concerns: unrealistic expectations, signs of instability, unusually broad scope, etc.
- Keep talking points concise (1-2 sentences) — they will be read during the interview itself.
- Questions to ask should be strategic and show depth, not basic research questions.
- Do not invent information not in the CV.
- elevatorPitch must be in first person, 2-3 sentences, and feel natural when spoken aloud — not like a summary.`;

function extractTextFromHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 15000);
}

async function resolveJobDescription(jd: string): Promise<string> {
  const isUrl = /^https?:\/\/.+/.test(jd.trim());
  if (!isUrl) return jd;

  const res = await fetch(jd.trim(), {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PrepKit/1.0)' },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) throw new Error(`Could not fetch the job URL (status ${res.status}). Please paste the job description as text instead.`);

  const html = await res.text();
  const text = extractTextFromHtml(html);

  if (text.length < 200) throw new Error("Couldn't extract enough content from that URL — the page may require a login. Please paste the job description as text.");

  return text;
}

async function fetchCompanyNews(company: string): Promise<NewsItem[]> {
  try {
    const query = encodeURIComponent(`${company} layoffs OR acquisition OR funding OR merger OR IPO OR restructuring`);
    const url = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return [];

    const xml = await res.text();
    const items: NewsItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
      const item = match[1];
      const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
                     item.match(/<title>(.*?)<\/title>/)?.[1] || '').trim();
      const link = item.match(/<link>(.*?)<\/link>/)?.[1]?.trim() || '';
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim() || '';
      const source = (item.match(/<source[^>]*>(.*?)<\/source>/)?.[1] || '').trim();

      if (title) {
        items.push({
          title: title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'),
          link,
          pubDate,
          source,
        });
      }
    }

    return items;
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const cvFile = formData.get('cv') as File;
    const rawJd = formData.get('jd') as string;

    if (!cvFile || !rawJd.trim()) {
      return NextResponse.json({ error: 'Missing CV or job description' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    // Extract text from PDF
    const cvBuffer = await cvFile.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(cvBuffer));
    const { text: cvText } = await extractText(pdf, { mergePages: true });

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json({ error: 'Could not extract text from the PDF. Make sure it is not scanned or image-based.' }, { status: 422 });
    }

    // Resolve job description (text or URL)
    let jobDescription: string;
    try {
      jobDescription = await resolveJobDescription(rawJd);
    } catch (err) {
      return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to fetch URL' }, { status: 422 });
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `CV / Resume:\n${cvText}\n\n---\n\nJob Description:\n${jobDescription}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content ?? '';
    const prepData = JSON.parse(responseText);

    // Fetch recent news in parallel (non-blocking — empty array on failure)
    const recentNews = await fetchCompanyNews(prepData.role?.company || '');
    prepData.recentNews = recentNews;

    return NextResponse.json(prepData);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error analyzing:', message);
    return NextResponse.json({ error: 'Failed to analyze. Please try again.' }, { status: 500 });
  }
}
