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

  it('Track(:track) 가 유효 트랙으로 렌더된다', () => {
    const { container } = render(
      <Providers path="/track/web">
        <Routes>
          <Route path="/track/:track" element={<Track />} />
        </Routes>
      </Providers>,
    )
    expect(container.firstChild).toBeTruthy()
  })
})
