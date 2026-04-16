import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
