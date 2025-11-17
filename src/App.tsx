import { useState } from "react";
import "./App.css";
import { Modal, Button, version, Typography, Layout } from "antd";
import ReactPlayer from "react-player";

const { Title } = Typography;

function App() {
  const [open, setOpen] = useState<boolean>(false);

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
          onClick={() => setOpen(true)}
          style={{ width: 400, height: 300 }}
        >
          Play video
        </Button>
        <Modal
          height={800}
          width={1000}
          centered
          title={
            <Title level={2} title="Video title">
              Video title
            </Title>
          }
          footer={
            <Button type="primary" onClick={() => setOpen(false)}>
              Close
            </Button>
          }
          open={open}
          onCancel={() => setOpen(false)}
        >
          <ReactPlayer
            muted={true}
            playing
            controls
            width="auto"
            height="auto"
            loop
            src="https://cdn.flowplayer.com/d9cd469f-14fc-4b7b-a7f6-ccbfa755dcb8/hls/383f752a-cbd1-4691-a73f-a4e583391b3d/playlist.m3u8"
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
}

export default App;
