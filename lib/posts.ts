import { getSupabase } from "./supabase";

/**
 * posts 테이블 CRUD 함수 모음.
 * 연결은 lib/supabase.ts 의 getSupabase() 를 재사용합니다.
 * (환경변수: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
 *
 * 테이블은 posts_setup.sql 을 Supabase SQL Editor 에서 먼저 실행해 생성하세요.
 */

export type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type PostInput = {
  title: string;
  content?: string;
};

// READ — 목록 (최신순)
export async function listPosts(): Promise<Post[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`listPosts 실패: ${error.message}`);
  return (data ?? []) as Post[];
}

// READ — 단건
export async function getPost(id: string): Promise<Post | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`getPost 실패: ${error.message}`);
  return (data as Post) ?? null;
}

// CREATE
export async function createPost(input: PostInput): Promise<Post> {
  const title = input.title.trim();
  if (!title) throw new Error("title 은 필수입니다.");

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content: input.content ?? "" })
    .select()
    .single();

  if (error) throw new Error(`createPost 실패: ${error.message}`);
  return data as Post;
}

// UPDATE — 전달한 필드만 부분 수정
export async function updatePost(
  id: string,
  input: Partial<PostInput>
): Promise<Post> {
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title.trim();
  if (input.content !== undefined) patch.content = input.content;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`updatePost 실패: ${error.message}`);
  return data as Post;
}

// DELETE
export async function deletePost(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) throw new Error(`deletePost 실패: ${error.message}`);
}
