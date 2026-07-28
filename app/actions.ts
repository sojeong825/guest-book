"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import { isCakeType, DEFAULT_CAKE } from "@/lib/cakes";

export type FormState = {
  error: string | null;
  success?: boolean;
};

export async function addEntry(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const isSecret = formData.get("is_secret") === "on";
  const cakeRaw = formData.get("cake");
  const cake = isCakeType(cakeRaw) ? cakeRaw : DEFAULT_CAKE;

  // 빈 입력 검증
  if (!name && !message) {
    return { error: "이름과 메시지를 입력해주세요." };
  }
  if (!name) {
    return { error: "이름을 입력해주세요." };
  }
  if (!message) {
    return { error: "메시지를 입력해주세요." };
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("guestbook")
      .insert({ name, message, is_secret: isSecret, cake });

    if (error) {
      console.error("Supabase insert error:", error);
      return { error: "저장에 실패했어요. 잠시 후 다시 시도해주세요." };
    }
  } catch (e) {
    console.error(e);
    return { error: "서버 설정을 확인해주세요. (Supabase 연결 실패)" };
  }

  revalidatePath("/");
  return { error: null, success: true };
}
