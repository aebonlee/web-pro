// 챕터 본문(.md)을 챕터별 청크로 lazy 로드 (초기 번들 경량화)
const loaders = import.meta.glob('./*.md', { query: '?raw', import: 'default' })

export const hasContent = (chapterId) => !!loaders[`./${chapterId}.md`]
export const loadContent = (chapterId) => {
  const fn = loaders[`./${chapterId}.md`]
  return fn ? fn() : Promise.resolve('')
}
