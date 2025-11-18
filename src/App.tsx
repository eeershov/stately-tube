import { Modal, Button, version, Typography, Layout } from "antd";
import ReactPlayer from "react-player";
import { playerMachine } from "./playerMachine";
import { useMachine } from "@xstate/react";
import { VIDEOS } from "./consts";

const { Title } = Typography;

function App() {
  const [state, send] = useMachine(playerMachine);
  const isMinimized = state.matches("minimized");
  const isOpen = !state.matches("idle");

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
        >
          Play video
        </Button>
        <Modal
          height={isMinimized ? 300 : 800}
          width={isMinimized ? 400 : 1000}
          destroyOnHidden
          centered
          title={
            <Title level={2} title="Video title">
              {state.context.video.title}
            </Title>
          }
          footer={
            <>
              <Button
                type="dashed"
                onClick={() => send({ type: "MINIMIZE_TOGGLE" })}
              >
                {isMinimized ? "Maximize" : "Minimize"}
              </Button>
              <Button
                onClick={() =>
                  send({
                    type: "CHANGE_VIDEO",
                    video: VIDEOS[Math.floor(Math.random() * VIDEOS.length)],
                  })
                }
              >
                Change to random video
              </Button>
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
