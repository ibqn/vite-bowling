import { BowlingFrame } from '@/components/bowling-frame'
import { frames } from '@/state'
import { type FrameIndex } from '@/types'
import { ThrowInput } from '@/components/throw-input'

export const BowlingGame = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-2 text-2xl font-bold">Bowling Game</h1>
      <ThrowInput remainingPins={10} />
      <div className="flex flex-row gap-1">
        {frames.value.map((frame, index) => {
          return (
            <BowlingFrame
              key={index}
              frameNumber={(index + 1) as FrameIndex}
              frame={frame}
            />
          )
        })}
      </div>
    </div>
  )
}
