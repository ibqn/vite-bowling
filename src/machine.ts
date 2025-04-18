import { assign, setup, assertEvent } from 'xstate'

type Context = {
  frameIndex: number
  throws: number[]
}

type ThrowEvent = {
  type: 'THROW'
  throw: number
}

type ResetEvent = { type: 'RESET' }
type Events = ThrowEvent | ResetEvent

export const bowlingMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },
  guards: {
    isStrikeAndRegularFrame: ({ context, event }) => {
      assertEvent(event, 'THROW')

      return (
        event.throw === 10 &&
        context.throws.length === 0 &&
        context.frameIndex < 9
      )
    },
    isStrikeAndLastFrameNext: ({ context, event }) => {
      assertEvent(event, 'THROW')

      return (
        event.throw === 10 &&
        context.throws.length === 0 &&
        context.frameIndex === 9
      )
    },
    isStrikeOrSpareInLastFrame: ({ context, event }) => {
      assertEvent(event, 'THROW')

      return event.throw + (context.throws?.[0] ?? 0) >= 10
    },
    isLastFrameNext: ({ context }) => context.frameIndex === 9,
  },
  actions: {
    updateFrameCount: assign({
      frameIndex: ({ context }) => context.frameIndex + 1,
    }),
    resetThrows: assign({ throws: [] }),
    updateThrows: assign({
      throws: ({ context, event }) => {
        assertEvent(event, 'THROW')

        return [...context.throws, event.throw]
      },
    }),
  },
}).createMachine({
  id: 'bowling',
  context: {
    frameIndex: 1,
    throws: [],
  },
  on: {
    RESET: {
      target: '.frame first throw',
      actions: assign({ frameIndex: 1, throws: [] }),
    },
  },
  initial: 'frame first throw',
  states: {
    'frame first throw': {
      on: {
        THROW: [
          {
            target: 'frame first throw',
            guard: 'isStrikeAndRegularFrame',
            actions: ['updateFrameCount', 'resetThrows'],
          },
          {
            target: 'last frame first throw',
            guard: 'isStrikeAndLastFrameNext',
            actions: ['updateFrameCount', 'resetThrows'],
          },
          {
            target: 'frame second throw',
            actions: ['updateThrows'],
          },
        ],
      },
    },
    'frame second throw': {
      on: {
        THROW: [
          {
            target: 'last frame first throw',
            guard: 'isLastFrameNext',
            actions: ['updateFrameCount', 'resetThrows'],
          },
          {
            target: 'frame first throw',
            actions: ['updateFrameCount', 'resetThrows'],
          },
        ],
      },
    },
    'last frame first throw': {
      on: {
        THROW: [
          {
            target: 'last frame second throw',
            actions: ['updateThrows'],
          },
        ],
      },
    },
    'last frame second throw': {
      on: {
        THROW: [
          {
            target: 'last frame third throw',
            guard: 'isStrikeOrSpareInLastFrame',
            actions: ['updateThrows'],
          },
          {
            target: 'completed',
          },
        ],
      },
    },
    'last frame third throw': {
      on: {
        THROW: [
          {
            target: 'completed',
          },
        ],
      },
    },
    completed: {},
  },
})
