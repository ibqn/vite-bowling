import { bowlingMachine } from '@/machine'
import { useMachine } from '@xstate/react'
import { useMemo } from 'preact/hooks'
import { frames } from '@/state'

export const ThrowInput = () => {
  const [state, send] = useMachine(bowlingMachine)

  const possiblePins = useMemo(() => {
    const { frameIndex } = state.context

    const totalPins = frames.value[frameIndex - 1].throw.reduce(
      (total: number, current): number => total + (current ?? 0),
      0
    )

    const remainingPins = 10 - (totalPins % 10)

    return Array.from({ length: remainingPins + 1 }, (_, index) => index)
  }, [state.context])

  const handleInput = (pins: number) => () => {
    send({ type: 'THROW', throw: pins })

    frames.value = frames.value.map((frame, index) => {
      if (index === state.context.frameIndex - 1) {
        return { ...frame, throw: [...frame.throw, pins] }
      }

      return frame
    })
  }

  if (state.matches('completed')) {
    return null
  }

  return (
    <div className="m-4 flex flex-row gap-1">
      {possiblePins.map((pins) => {
        return (
          <button
            className="rounded-lg border bg-slate-100 px-4 py-1 transition hover:scale-105 hover:bg-slate-50"
            onClick={handleInput(pins)}
          >
            {pins}
          </button>
        )
      })}
    </div>
  )
}
