import { supabase, T } from './supabase'

// ===== 프로필 =====
export async function upsertProfile(user) {
  if (!user) return
  const meta = user.user_metadata || {}
  const row = {
    id: user.id,
    email: user.email,
    name: meta.full_name || meta.name || meta.nickname || (user.email || '').split('@')[0],
    avatar_url: meta.avatar_url || meta.picture || null,
    provider: (user.app_metadata && user.app_metadata.provider) || null,
    last_login_at: new Date().toISOString(),
  }
  const { error } = await supabase.from(T.profiles).upsert(row, { onConflict: 'id' })
  if (error) console.warn('upsertProfile', error.message)
}

// ===== 진도 =====
export async function fetchProgress(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from(T.progress)
    .select('chapter_id, section_no, completed, updated_at')
    .eq('user_id', userId)
  if (error) {
    console.warn('fetchProgress', error.message)
    return []
  }
  return data || []
}

export async function setSectionDone(userId, chapterId, sectionNo, completed) {
  if (!userId) return { error: { message: '로그인이 필요합니다.' } }
  const row = {
    user_id: userId,
    chapter_id: chapterId,
    section_no: sectionNo,
    completed,
    updated_at: new Date().toISOString(),
  }
  return supabase.from(T.progress).upsert(row, { onConflict: 'user_id,chapter_id,section_no' })
}
