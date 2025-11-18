import { assertEvent, assign, setup } from "xstate";
import { VIDEOS } from "./consts";

type Context = {
  video: {
    title: string;
    url: string;
  };
  isPlaying: boolean;
};

type Events =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "MINIMIZE_TOGGLE" }
  | { type: "CHANGE_VIDEO"; video: { title: string; url: string } }
  | { type: "TOGGLE_PLAYBACK" }
  | { type: "PLAY" }
  | { type: "PAUSE" };

export const playerMachine = setup({
  types: {} as {
    context: Context;
    events: Events;
  },
  actions: {
    changeVideo: assign({
      isPlaying: false,
      video: ({ event }) => {
        assertEvent(event, "CHANGE_VIDEO");
        return event.video;
      },
    }),
    play: assign({ isPlaying: true }),
    pause: assign({ isPlaying: false }),
  },
}).createMachine({
  id: "videoPlayer",
  initial: "idle",
  context: {
    video: VIDEOS[0],
    isPlaying: true,
  },

  on: {
    CHANGE_VIDEO: {
      actions: "changeVideo",
    },
  },

  states: {
    idle: {
      entry: "pause",
      on: {
        OPEN: { target: "modal" },
      },
    },

    modal: {
      entry: "play",
      on: {
        CLOSE: { target: "idle" },
        MINIMIZE_TOGGLE: { target: "minimized" },
        PLAY: { actions: "play" },
        PAUSE: { actions: "pause" },
      },
    },

    minimized: {
      on: {
        CLOSE: { target: "idle" },
        MINIMIZE_TOGGLE: { target: "modal" },
        PLAY: { actions: "play" },
        PAUSE: { actions: "pause" },
      },
    },
  },
});
