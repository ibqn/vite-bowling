import { signal } from '@preact/signals'
import { Frame, FrameIndex } from '@/types'

export const frames = signal(Array.from({ length: 10 }, () => ({}) as Frame))

export const frameIndex = signal<FrameIndex>(1)
