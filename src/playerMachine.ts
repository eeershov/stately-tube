import { assertEvent, assign, setup } from "xstate";
import { VIDEOS } from "./consts";

type Context = {
  video: {
    title: string;
    url: string;
  };
  isPlaying: boolean;
  videoBounds: { left: number; top: number; bottom: number; right: number };
  videoHistory: { videoUrl: string; rating: number }[];
};

type Events =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "MINIMIZE_TOGGLE" }
  | { type: "CHANGE_VIDEO"; video: { title: string; url: string } }
  | { type: "RATE"; videoRated: { videoUrl: string; rating: number } }
  | {
      type: "DRAG_MINIMIZED";
      videoBounds: { left: number; top: number; bottom: number; right: number };
    }
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
    dragVideo: assign({
      videoBounds: ({ event }) => {
        assertEvent(event, "DRAG_MINIMIZED");
        return event.videoBounds;
      },
    }),
    resetVideoBounds: assign({
      videoBounds: { bottom: 0, left: 0, right: 0, top: 0 },
    }),
    rate: assign({
      videoHistory: ({ context, event }) => {
        assertEvent(event, "RATE");
        const { videoUrl, rating } = event.videoRated;

        const historyWithoutCurrent = context.videoHistory.filter(
          (item) => item.videoUrl !== videoUrl
        );

        return [...historyWithoutCurrent, { videoUrl, rating }];
      },
    }),
  },
}).createMachine({
  id: "videoPlayer",
  initial: "idle",
  context: {
    video: VIDEOS[0],
    isPlaying: false,
    videoBounds: { bottom: 0, left: 0, right: 0, top: 0 },
    videoHistory: [],
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
        OPEN: { target: "modal", actions: "resetVideoBounds" },
      },
    },

    modal: {
      entry: "play",
      on: {
        CLOSE: { target: "idle" },
        MINIMIZE_TOGGLE: { target: "minimized" },
        PLAY: { actions: "play" },
        PAUSE: { actions: "pause" },
        RATE: { actions: "rate" },
      },
    },

    minimized: {
      on: {
        DRAG_MINIMIZED: { actions: "dragVideo" },
        CLOSE: { target: "idle" },
        MINIMIZE_TOGGLE: { actions: "resetVideoBounds", target: "modal" },
        PLAY: { actions: "play" },
        PAUSE: { actions: "pause" },
        RATE: { actions: "rate" },
      },
    },
  },
});
