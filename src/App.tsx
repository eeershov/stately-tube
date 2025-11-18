import { Modal, Button, version, Typography, Layout } from "antd";
import ReactPlayer from "react-player";
import { playerMachine } from "./playerMachine";
import { useMachine } from "@xstate/react";
import { VIDEOS } from "./consts";
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import { useRef } from "react";

const { Title } = Typography;

function App() {
  const [state, send] = useMachine(playerMachine);
  const isMinimized = state.matches("minimized");
  const isOpen = !state.matches("idle");
  const draggleRef = useRef<HTMLDivElement>(null!);

  const handleRandomVideo = () => {
    const uniqueVideos = VIDEOS.filter(
      (video) => video.url !== state.context.video.url
    );
    send({
      type: "CHANGE_VIDEO",
      video: uniqueVideos[Math.floor(Math.random() * uniqueVideos.length)],
    });
  };

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    send({
      type: "DRAG_MINIMIZED",
      videoBounds: {
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y),
      },
    });
  };

  return (
    <Layout
      style={{
        height: "100vh",
        overflow: "clip",
      }}
    >
      <Layout.Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Title level={5}>antd version: {version}</Title>
        <Button
          type="primary"
          onClick={() => send({ type: "OPEN" })}
          style={{ width: 400, height: 300 }}
          disabled={isOpen}
        >
          Play video
        </Button>
        <Modal
          height={isMinimized ? 300 : 800}
          width={isMinimized ? 400 : 1000}
          destroyOnHidden
          centered
          wrapClassName={isMinimized ? "floating-minimized-player" : undefined}
          mask={!isMinimized}
          maskClosable={!isMinimized}
          title={
            <div style={{ cursor: isMinimized ? "move" : "auto" }}>
              <Title level={2} title="Video title">
                {state.context.video.title}
              </Title>
            </div>
          }
          footer={
            <>
              <Button
                type="dashed"
                onClick={() => send({ type: "MINIMIZE_TOGGLE" })}
              >
                {isMinimized ? "Maximize" : "Minimize"}
              </Button>
              <Button onClick={handleRandomVideo}>Random video</Button>
              <Button
                onClick={() =>
                  state.context.isPlaying
                    ? send({ type: "PAUSE" })
                    : send({ type: "PLAY" })
                }
              >
                {state.context.isPlaying ? "Pause" : "Play"}
              </Button>
            </>
          }
          open={isOpen}
          onCancel={() => send({ type: "CLOSE" })}
          modalRender={(modal) => (
            <Draggable
              disabled={!isMinimized}
              bounds={state.context.videoBounds}
              nodeRef={draggleRef}
              onStart={(event, uiData) => onStart(event, uiData)}
            >
              <div ref={draggleRef}>{modal}</div>
            </Draggable>
          )}
        >
          <ReactPlayer
            src={state.context.video.url}
            playing={state.context.isPlaying}
            controls={true}
            width="auto"
            height="auto"
            muted={false}
            loop={true}
            onPlay={() => send({ type: "PLAY" })}
            onPause={() => send({ type: "PAUSE" })}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
}

export default App;
