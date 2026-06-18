// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../hooks/useAuth'
import { ProgressProvider } from '../hooks/useProgress'

import Home from './Home'
import Curriculum from './Curriculum'
import Projects from './Projects'
import Quiz from './Quiz'
import Resources from './Resources'
import About from './About'
import Coaching from './Coaching'
import NotFound from './NotFound'
import Login from './Login'
import Track from './Track'
import Lesson from './Lesson'
import ProjectDetail from './ProjectDetail'
import GuideDetail from './GuideDetail'
import MyPage from './MyPage'

afterEach(cleanup)

function Providers({ children, path = '/' }) {
  return (
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <ProgressProvider>{children}</ProgressProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

// useParams 없이 렌더되는 페이지들
const SIMPLE = [
  ['Home', Home],
  ['Curriculum', Curriculum],
  ['Projects', Projects],
  ['Quiz', Quiz],
  ['Resources', Resources],
  ['About', About],
  ['Coaching', Coaching],
  ['NotFound', NotFound],
  ['Login', Login],
]

describe('페이지 렌더 스모크(빌드가 못 잡는 런타임 오류 방지)', () => {
  for (const [name, Page] of SIMPLE) {
    it(`${name} 가 오류 없이 마운트된다`, () => {
      const { container } = render(<Providers><Page /></Providers>)
      expect(container.firstChild).toBeTruthy()
    })
  }

  // 파라미터 라우트 페이지들
  const PARAM = [
    ['Track', '/track/web', '/track/:track', Track],
    ['Lesson', '/lesson/web-01', '/lesson/:id', Lesson],
    ['ProjectDetail', '/project/p-todo', '/project/:id', ProjectDetail],
    ['GuideDetail', '/coaching/coach-1', '/coaching/:id', GuideDetail],
    ['MyPage', '/me', '/me', MyPage],
  ]
  for (const [name, path, pattern, Page] of PARAM) {
    it(`${name} 가 오류 없이 마운트된다`, () => {
      const { container } = render(
        <Providers path={path}>
          <Routes>
            <Route path={pattern} element={<Page />} />
          </Routes>
        </Providers>,
      )
      expect(container.firstChild).toBeTruthy()
    })
  }
})
