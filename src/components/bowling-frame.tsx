import { frameIndex } from '@/state'
import { Frame, FrameIndex } from '@/types'
import { cn } from '@/util/class-names'
import { type ComponentChildren } from 'preact'

type Props = {
  frame: Frame
  frameNumber: FrameIndex
}

export const BowlingFrame = (props: Props) => {
  const { frameNumber, frame } = props

  const setCurrentFrame = () => {
    frameIndex.value = frameNumber
  }

  const firstThrow = frame.throw.at(0)
  const secondThrow = frame.throw.at(1)
  const thirdThrow = frame.throw.at(2)

  let firstDisplay: ComponentChildren = firstThrow
  let secondDisplay: ComponentChildren = secondThrow
  let thirdDisplay: ComponentChildren = thirdThrow

  if (firstThrow === 10) {
    firstDisplay = undefined
    secondDisplay = 'x'
  } else if ((firstThrow ?? 0) + (secondThrow ?? 0) === 10) {
    secondDisplay = '/'
  }

  if (frameNumber === 10) {
    if (thirdThrow === 10) {
      thirdDisplay = 'x'
    }

    if (firstThrow === 10) {
      firstDisplay = 'x'
      secondDisplay = secondThrow

      if (secondThrow === 10) {
        secondDisplay = 'x'
      } else if ((secondThrow ?? 0) + (thirdThrow ?? 0) === 10) {
        thirdDisplay = '/'
      }
    }
  }

  return (
    <div
      className={cn(
        frameNumber === frameIndex.value
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-teal-300 hover:bg-teal-400',
        'w-20 cursor-pointer select-none border border-slate-500',
        'transition hover:scale-105'
      )}
      onClick={setCurrentFrame}
    >
      <div className="border-b border-slate-500 p-1 text-center">
        {frameNumber}
      </div>
      <div className="flex flex-row">
        <div className="flex-1 p-1 text-center">
          {firstDisplay ?? <>&nbsp;</>}
        </div>

        <div className="flex-1 border-b border-l border-slate-500 p-1 text-center">
          {secondDisplay ?? <>&nbsp;</>}
        </div>

        {frameNumber === 10 && (firstThrow ?? 0) + (secondThrow ?? 0) >= 10 && (
          <div className="flex-1 border-b border-l border-slate-500 p-1 text-center">
            {thirdDisplay ?? <>&nbsp;</>}
          </div>
        )}
      </div>

      <div className="p-1 text-center">{frame?.score ?? <>&nbsp;</>}</div>
    </div>
  )
}
