import { Star } from 'lucide-react'

const objects = [
  { left: '8%', top: '12%', size: 'clamp(72px, 9vw, 150px)', delay: '0s' },
  { left: '28%', top: '26%', size: 'clamp(96px, 12vw, 190px)', delay: '-1.8s' },
  { left: '58%', top: '10%', size: 'clamp(68px, 8vw, 132px)', delay: '-3.2s' },
  { left: '82%', top: '28%', size: 'clamp(84px, 10vw, 160px)', delay: '-2.4s' },
  { left: '15%', top: '62%', size: 'clamp(72px, 9vw, 142px)', delay: '-4.1s' },
  { left: '46%', top: '56%', size: 'clamp(92px, 11vw, 176px)', delay: '-0.8s' },
  { left: '75%', top: '70%', size: 'clamp(72px, 8vw, 136px)', delay: '-2.9s' },
]

function FocusField() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      <div className="focus-field__glass absolute inset-0" />
      {objects.map((object, index) => (
        <div
          key={`${object.left}-${object.top}`}
          className="focus-object group absolute pointer-events-auto"
          style={{
            left: object.left,
            top: object.top,
            width: object.size,
            height: object.size,
            animationDelay: object.delay,
          }}
        >
          <span className="focus-object__glow absolute inset-0 rounded-full" />
          <Star
            size={index % 2 === 0 ? 34 : 42}
            strokeWidth={1.5}
            fill="currentColor"
            className="focus-object__star absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#321052]"
          />
        </div>
      ))}
    </div>
  )
}

export default FocusField
