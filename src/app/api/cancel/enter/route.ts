import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { user_id } = await req.json();

  // Randomly assign variant A or B
  const variant = Math.random() < 0.5 ? "A" : "B";

  const { error } = await supabase
    .from("cancellations")
    .insert([{ user_id, downsell_variant: variant }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ variant });
}