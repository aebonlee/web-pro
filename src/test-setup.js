// 테스트(jsdom) 환경에 브라우저 전용 API 폴리필 — 실제 브라우저엔 존재
class IOStub {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}

if (!globalThis.IntersectionObserver) globalThis.IntersectionObserver = IOStub
if (!globalThis.ResizeObserver) globalThis.ResizeObserver = IOStub
if (typeof globalThis.matchMedia === 'undefined') {
  globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })
}
