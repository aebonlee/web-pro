import { useReveal } from '../hooks/useReveal'

// 자식을 아래에서 위로 페이드인. delay(ms), as(태그) 지원
export default function Reveal({ children, delay = 0, y = 40, style, as: Tag = 'div', ...rest }) {
  const [ref, shown] = useReveal()
  return (
    <Tag
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity .7s ${delay}ms cubic-bezier(.2,.7,.2,1), transform .7s ${delay}ms cubic-bezier(.2,.7,.2,1)`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
