import { frameIndex } from '@/state'
import { Frame, FrameIndex } from '@/types'
import { cn } from '@/util/class-names'

type Props = {
  frame: Frame
  frameNumber: FrameIndex
}

export const BowlingFrame = (props: Props) => {
  const { frameNumber, frame } = props

  const setCurrentFrame = () => {
    frameIndex.value = frameNumber
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
        <div className="flex-1 p-1 text-center">3</div>
        {frameNumber === 10 && <div className="flex-1 p-1 text-center">7</div>}
        <div className="flex-1 border-b border-l border-slate-500 p-1 text-center">
          /
        </div>
      </div>

      <div className="p-1 text-center">{frame?.score ?? 'score'}</div>
    </div>
  )
}
