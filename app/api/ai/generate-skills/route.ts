import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 优先解析完整响应，再尝试从附带说明的文本中提取数组。
// Parse the full response first, then try extracting an array from surrounding text.
function extractJsonArray(text: string) {
  const trimmed = text.trim();

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    const match = trimmed.match(/\[[\s\S]*\]/);

    if (!match) {
      return [];
    }

    try {
      const parsed = JSON.parse(match[0]);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

// 为已登录用户从职位描述中提取技能，供表单预填。
// Extract skills from a job description to prefill the form for a signed-in user.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY." }, { status: 500 });
  }

  const body = (await request.json()) as {
    description?: string;
  };

  const description = body.description?.trim() || "";
  // console.log(description);

  if (!description) {
    return NextResponse.json({ error: "Job description is required." }, { status: 400 });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      input: [
        {
          role: "system",
          content:
            "Extract the most relevant professional skills from a job description. Return only a JSON array of short skill strings."
        },
        {
          role: "user",
          content: `Job description:\n${description}`
        }
      ]
    });
    // console.log(response);

    // 将数组元素统一转成字符串，并移除首尾空白及空项。
    // Convert array entries to strings, trim whitespace, and drop empty entries.
    const skills = extractJsonArray(response.output_text)
      .map((skill) => String(skill).trim())
      .filter(Boolean);

    if (skills.length === 0) {
      return NextResponse.json(
        { error: "The AI response did not contain a valid skills array." },
        { status: 500 }
      );
    }

    return NextResponse.json({ skills });
  } catch {
    return NextResponse.json({ error: "OpenAI skill generation failed." }, { status: 500 });
  }
}
