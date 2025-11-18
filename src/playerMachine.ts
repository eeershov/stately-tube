import { setup } from "xstate";

export const playerMachine = setup({}).createMachine({
  id: "videoPlayer",
  initial: "idle",
  context: {
    videoUrl:
      "https://cdn.flowplayer.com/d9cd469f-14fc-4b7b-a7f6-ccbfa755dcb8/hls/383f752a-cbd1-4691-a73f-a4e583391b3d/playlist.m3u8",
  },
  states: {
    idle: {
      on: {
        OPEN: { target: "modal" },
      },
    },

    modal: {
      on: {
        CLOSE: { target: "idle" },
        MINIMIZE_TOGGLE: { target: "minimized" },
      },
    },

    minimized: {
      on: {
        MINIMIZE_TOGGLE: { target: "modal" },
        CLOSE: { target: "idle" },
      },
    },
  },
});
