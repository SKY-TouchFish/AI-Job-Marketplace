import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateProfileInput } from "@/lib/profile/validation";

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    displayName?: string;
    skills?: string;
  };

  const validation = validateProfileInput(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: validation.data.displayName,
    skills: validation.data.skills
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Profile updated successfully." });
}
