import { bowlingMachine } from '@/machine'
import { useMachine } from '@xstate/react'
import { useMemo } from 'preact/hooks'
import { frames } from '@/state'
import { batch } from '@preact/signals'

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

  const updateScore = () => {
    let currentScore = 0

    for (const [index, frame] of frames.value.entries()) {
      if (frame?.score) {
        currentScore = frame.score
        continue
      }

      if (index + 1 < 10) {
        if (frame.throw.at(0) !== 10 && frame.throw.length < 2) {
          return
        }
      } else if (
        ((frame.throw.at(0) ?? 0) + (frame.throw.at(1) ?? 0) >= 10 &&
          frame.throw.length !== 3) ||
        frame.throw.length < 2
      ) {
        return
      }

      const frameScore = frame.throw.reduce(
        (total: number, current): number => total + (current ?? 0),
        0
      )

      let bonusScore = 0
      if (index + 1 < 10) {
        if (frame.throw.at(0) === 10) {
          const nextFrame = frames.value.at(index + 1)

          if (!nextFrame) {
            return
          }

          if (nextFrame.throw.length === 2) {
            bonusScore =
              (nextFrame.throw.at(0) ?? 0) + (nextFrame.throw.at(1) ?? 0)
          } else if (nextFrame.throw.length === 1) {
            const secondNextFrame = frames.value.at(index + 2)

            if (!secondNextFrame) {
              return
            }

            if (secondNextFrame.throw.length > 0) {
              bonusScore =
                (nextFrame.throw.at(0) ?? 0) +
                (secondNextFrame.throw.at(0) ?? 0)
            } else {
              return
            }
          } else {
            return
          }
        } else if ((frame.throw.at(0) ?? 0) + (frame.throw.at(1) ?? 0) === 10) {
          const nextFrame = frames.value.at(index + 1)

          if (!nextFrame) {
            return
          }

          if (nextFrame.throw.length > 0) {
            bonusScore = nextFrame.throw.at(0) ?? 0
          } else {
            return
          }
        }
      }

      currentScore += frameScore + bonusScore

      frames.value = frames.value.map((frame, frameIndex) => {
        if (index === frameIndex) {
          return { ...frame, score: currentScore }
        }

        return frame
      })
    }
  }

  const handleInput = (pins: number) => () => {
    send({ type: 'THROW', throw: pins })

    batch(() => {
      frames.value = frames.value.map((frame, index) => {
        if (index === state.context.frameIndex - 1) {
          return { ...frame, throw: [...frame.throw, pins] }
        }

        return frame
      })

      updateScore()
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
