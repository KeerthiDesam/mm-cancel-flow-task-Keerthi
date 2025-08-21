import { supabase } from "@/lib/supabase";

/**
 * Get or assign a deterministic A/B downsell variant for the user
 */
export async function getOrAssignVariant(userId: string, subscriptionId: string) {
  // Check if user already has a cancellation with a variant
  const { data: existing } = await supabase
    .from("cancellations")
    .select("downsell_variant")
    .eq("user_id", userId)
    .eq("subscription_id", subscriptionId)
    .limit(1)
    .single();

  if (existing) {
    return existing.downsell_variant as "A" | "B";
  }

  // ✅ Secure RNG in browser
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const randomBit = array[0] % 2;
  const variant = randomBit === 0 ? "A" : "B";

  // Insert initial row into cancellations with variant
  await supabase.from("cancellations").insert([
    {
      user_id: userId,
      subscription_id: subscriptionId,
      downsell_variant: variant,
      accepted_downsell: false,
    },
  ]);

  return variant;
}
