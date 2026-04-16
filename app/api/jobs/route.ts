import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateCreateJobInput } from "@/lib/jobs/validation";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    description?: string;
    requiredSkills?: string;
  };

  const validation = validateCreateJobInput(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { error } = await supabase.from("jobs").insert({
    title: validation.data.title,
    description: validation.data.description,
    required_skills: validation.data.requiredSkills,
    created_by: user.id
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Job created successfully." }, { status: 201 });
}
