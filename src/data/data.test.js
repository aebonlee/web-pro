import { describe, it, expect } from 'vitest'
import { CHAPTERS, TRACKS, byTrack, getChapter, TOTAL_CHAPTERS, TOTAL_LESSONS } from './curriculum'
import { QUIZZES, GLOSSARY, quizOf } from './review'
import { PROJECTS, PROJECT_LEVELS, getProject } from './projects'
import { LABS } from './labs'

const TRACK_IDS = Object.keys(TRACKS) // web, react, ai, ops

describe('curriculum 데이터 무결성', () => {
  it('챕터/강의 합계가 일치한다', () => {
    expect(TOTAL_CHAPTERS).toBe(CHAPTERS.length)
    const sec = CHAPTERS.reduce((n, c) => n + c.sections.length, 0)
    expect(TOTAL_LESSONS).toBe(sec)
  })

  it('모든 챕터 id가 고유하고 트랙이 유효하다', () => {
    const ids = CHAPTERS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const c of CHAPTERS) {
      expect(TRACK_IDS).toContain(c.track)
      expect(c.sections.length).toBeGreaterThan(0)
      expect(typeof c.title).toBe('string')
      expect(c.title.length).toBeGreaterThan(0)
    }
  })

  it('섹션 번호가 챕터 내에서 고유하다', () => {
    for (const c of CHAPTERS) {
      const nos = c.sections.map((s) => s.no)
      expect(new Set(nos).size).toBe(nos.length)
    }
  })

  it('byTrack / getChapter 헬퍼가 동작한다', () => {
    const total = TRACK_IDS.reduce((n, t) => n + byTrack(t).length, 0)
    expect(total).toBe(CHAPTERS.length)
    expect(getChapter(CHAPTERS[0].id)).toBe(CHAPTERS[0])
    expect(getChapter('없는-id')).toBeUndefined()
  })
})

describe('review(용어/퀴즈) 무결성', () => {
  it('모든 QUIZZES 키가 실제 챕터다', () => {
    for (const id of Object.keys(QUIZZES)) {
      expect(getChapter(id)).toBeTruthy()
    }
  })

  it('모든 챕터에 퀴즈가 있다', () => {
    for (const c of CHAPTERS) {
      expect(quizOf(c.id).length).toBeGreaterThan(0)
    }
  })

  it('퀴즈 문항이 4지선다·유효 정답 인덱스·해설을 갖는다', () => {
    for (const list of Object.values(QUIZZES)) {
      for (const q of list) {
        expect(Array.isArray(q.options)).toBe(true)
        expect(q.options.length).toBe(4)
        expect(q.answer).toBeGreaterThanOrEqual(0)
        expect(q.answer).toBeLessThan(4)
        expect(typeof q.explain).toBe('string')
      }
    }
  })

  it('용어집 항목이 term/def/유효 트랙을 갖는다', () => {
    for (const g of GLOSSARY) {
      expect(g.term.length).toBeGreaterThan(0)
      expect(g.def.length).toBeGreaterThan(0)
      expect(TRACK_IDS).toContain(g.track)
      expect(getChapter(g.chapter)).toBeTruthy()
    }
  })
})

describe('projects 무결성', () => {
  it('레벨이 유효하고 관련 챕터가 모두 존재한다', () => {
    for (const p of PROJECTS) {
      expect(PROJECT_LEVELS).toContain(p.level)
      expect(p.features.length).toBeGreaterThan(0)
      for (const cid of p.chapters) {
        expect(getChapter(cid)).toBeTruthy()
      }
    }
  })

  it('프로젝트 id가 고유하고 getProject가 동작한다', () => {
    const ids = PROJECTS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(getProject(PROJECTS[0].id)).toBe(PROJECTS[0])
  })
})

describe('labs 커버리지', () => {
  it('모든 챕터에 실습 랩이 있다', () => {
    for (const c of CHAPTERS) {
      expect(Array.isArray(LABS[c.id])).toBe(true)
      expect(LABS[c.id].length).toBeGreaterThan(0)
    }
  })
})

describe('퀴즈 채점 로직', () => {
  // Quiz 컴포넌트의 채점과 동일한 순수 계산
  const grade = (questions, answers) =>
    questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0)

  it('정답 수를 정확히 센다', () => {
    const qs = [{ answer: 1 }, { answer: 0 }, { answer: 3 }]
    expect(grade(qs, { 0: 1, 1: 0, 2: 3 })).toBe(3) // 전부 정답
    expect(grade(qs, { 0: 1, 1: 2, 2: 3 })).toBe(2) // 1개 오답
    expect(grade(qs, {})).toBe(0) // 무응답
  })
})
