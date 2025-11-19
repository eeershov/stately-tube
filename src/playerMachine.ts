import { assertEvent, assign, setup } from "xstate";
import { VIDEOS } from "./consts";
import type { VideoType, VideoBounds, VideoRating } from "./types";
import {
  saveVideoHistoryToLocalStorage,
  loadVideoHistoryFromLocalStorage,
} from "./utils";

interface Context {
  video: VideoType;
  isPlaying: boolean;
  videoBounds: VideoBounds;
  videoHistory: VideoRating[];
}

interface Input {
  initialVideo?: VideoType;
}

type Events =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "MINIMIZE_TOGGLE" }
  | { type: "CHANGE_VIDEO"; video: VideoType }
  | { type: "RATE"; videoRated: VideoRating }
  | {
      type: "DRAG_MINIMIZED";
      videoBounds: VideoBounds;
    }
  | { type: "TOGGLE_PLAYBACK" }
  | { type: "PLAY" }
  | { type: "PAUSE" };

export const playerMachine = setup({
  types: {} as {
    context: Context;
    events: Events;
    input: Input;
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

        const newHistory = [...historyWithoutCurrent, { videoUrl, rating }];
        saveVideoHistoryToLocalStorage(newHistory);
        return newHistory;
      },
    }),
  },
}).createMachine({
  id: "videoPlayer",
  initial: "idle",
  context: ({ input }) => ({
    video: input.initialVideo || VIDEOS[0],
    isPlaying: false,
    videoBounds: { bottom: 0, left: 0, right: 0, top: 0 },
    videoHistory: loadVideoHistoryFromLocalStorage(),
  }),

  on: {
    CHANGE_VIDEO: {
      actions: ["changeVideo", "play"],
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
