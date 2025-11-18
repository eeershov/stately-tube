import { Modal, Button, version, Typography, Layout } from "antd";
import ReactPlayer from "react-player";
import { playerMachine } from "./playerMachine";
import { useMachine } from "@xstate/react";

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
        <h1>antd version: {version}</h1>
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
          centered
          title={
            <Title level={2} title="Video title">
              Video title
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
              <Button type="primary" onClick={() => send({ type: "CLOSE" })}>
                Close
              </Button>
            </>
          }
          open={isOpen}
          onCancel={() => send({ type: "CLOSE" })}
        >
          <ReactPlayer
            muted={true}
            playing
            controls
            width="auto"
            height="auto"
            loop
            src={state.context.videoUrl}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
}

export default App;
