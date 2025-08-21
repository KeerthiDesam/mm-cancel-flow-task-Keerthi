import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { user_id } = await req.json();

  const { error } = await supabase
    .from("cancellations")
    .update({ confirmed: true, confirmed_at: new Date().toISOString() })
    .eq("user_id", user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}