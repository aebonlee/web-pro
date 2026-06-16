import { createContext, useContext, useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { fetchProgress, setSectionDone } from '../lib/db'

const Ctx = createContext(null)

export function ProgressProvider({ children }) {
  const { user } = useAuth()
  const [rows, setRows] = useState([])

  const reload = useCallback(async () => {
    if (!user) { setRows([]); return }
    setRows(await fetchProgress(user.id))
  }, [user])

  useEffect(() => { reload() }, [reload])

  // chapterId -> Set(section_no 완료)
  const completedSet = (chapterId) =>
    new Set(rows.filter((r) => r.chapter_id === chapterId && r.completed).map((r) => r.section_no))

  const doneCount = (chapterId) => completedSet(chapterId).size

  const toggle = useCallback(async (chapterId, sectionNo, next) => {
    if (!user) return false
    // 낙관적 업데이트
    setRows((prev) => {
      const i = prev.findIndex((r) => r.chapter_id === chapterId && r.section_no === sectionNo)
      if (i >= 0) { const c = [...prev]; c[i] = { ...c[i], completed: next }; return c }
      return [...prev, { chapter_id: chapterId, section_no: sectionNo, completed: next }]
    })
    const { error } = await setSectionDone(user.id, chapterId, sectionNo, next)
    if (error) { reload(); return false }
    return true
  }, [user, reload])

  return (
    <Ctx.Provider value={{ rows, reload, completedSet, doneCount, toggle, isAuthed: !!user }}>
      {children}
    </Ctx.Provider>
  )
}

export const useProgress = () => useContext(Ctx)
