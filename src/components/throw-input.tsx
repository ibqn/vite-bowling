import { useMemo } from 'preact/hooks'

type Props = {
  remainingPins?: number
}

export const ThrowInput = ({ remainingPins = 10 }: Props) => {
  const possiblePins = useMemo(
    () => Array.from({ length: remainingPins + 1 }, (_, index) => index),
    [remainingPins]
  )

  return (
    <div className="m-4 flex flex-row gap-1">
      {possiblePins.map((pins) => {
        return (
          <button className="rounded-lg border bg-slate-100 px-4 py-1 transition hover:scale-105 hover:bg-slate-50">
            {pins}
          </button>
        )
      })}
    </div>
  )
}
