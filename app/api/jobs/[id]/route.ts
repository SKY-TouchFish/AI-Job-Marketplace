import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateCreateJobInput } from "@/lib/jobs/validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, created_by")
    .eq("id", id)
    .single();

  if (jobError || !job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }

  if (job.created_by !== user.id) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
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

  const { error } = await supabase
    .from("jobs")
    .update({
      title: validation.data.title,
      description: validation.data.description,
      required_skills: validation.data.requiredSkills
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Job updated successfully." });
}
