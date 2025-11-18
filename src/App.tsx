import {
  Modal,
  Button,
  version,
  Typography,
  Layout,
  Divider,
  Space,
  Card,
  Rate,
  Flex,
} from "antd";
import ReactPlayer from "react-player";
import { playerMachine } from "./playerMachine";
import { useMachine } from "@xstate/react";
import { VIDEOS } from "./consts";
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import { useRef } from "react";
import {
  ArrowsAltOutlined,
  CaretRightOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  ShrinkOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

function App() {
  const [state, send] = useMachine(playerMachine);
  const isMinimized = state.matches("minimized");
  const isOpen = !state.matches("idle");
  const draggleRef = useRef<HTMLDivElement>(null!);

  const currentVideoUrl = state.context.video.url;
  const currentRatingEntry = state.context.videoHistory.find(
    (viewedVideo) => viewedVideo.videoUrl === currentVideoUrl
  );
  const currentRating = currentRatingEntry ? currentRatingEntry.rating : 0;

  const handleRandomVideo = () => {
    const uniqueVideos = VIDEOS.filter(
      (video) => video.url !== currentVideoUrl
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
        <Card
          title="Welcome to the Stately-Tube"
          style={{ width: "min-content" }}
        >
          <Button
            type="link"
            onClick={() => send({ type: "OPEN" })}
            style={{
              width: 300,
              height: 180,
              border: 2,
              borderColor: "blue",
              borderStyle: "solid",
            }}
            disabled={isOpen}
          >
            <PlayCircleOutlined style={{ fontSize: 64 }} />
          </Button>
          <Divider />
          <Card type="inner" title="Tech stack" style={{ width: "" }}>
            <Typography>
              Vite, React, Typescript, react-player, antd {version}
            </Typography>
          </Card>
        </Card>
        <Modal
          height={isMinimized ? 300 : 800}
          width={isMinimized ? 500 : 1000}
          destroyOnHidden
          centered
          wrapClassName={isMinimized ? "floating-minimized-player" : undefined}
          mask={!isMinimized}
          maskClosable={!isMinimized}
          title={
            <div
              style={{
                cursor: isMinimized ? "move" : "auto",
              }}
            >
              <Title level={2} title="Video title">
                {state.context.video.title}
              </Title>
            </div>
          }
          footer={
            <Flex justify="space-between">
              <Rate
                value={currentRating}
                onChange={(value) => {
                  send({
                    type: "RATE",
                    videoRated: {
                      videoUrl: state.context.video.url,
                      rating: value,
                    },
                  });
                }}
              />

              <Flex gap="small">
                <Button onClick={handleRandomVideo}>Random video</Button>
                <Button
                  type="dashed"
                  onClick={() => send({ type: "MINIMIZE_TOGGLE" })}
                >
                  {isMinimized ? <ArrowsAltOutlined /> : <ShrinkOutlined />}
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    state.context.isPlaying
                      ? send({ type: "PAUSE" })
                      : send({ type: "PLAY" })
                  }
                >
                  {state.context.isPlaying ? (
                    <PauseOutlined />
                  ) : (
                    <CaretRightOutlined />
                  )}
                </Button>
              </Flex>
            </Flex>
          }
          open={isOpen}
          onCancel={() => send({ type: "CLOSE" })}
          modalRender={(modal) => (
            <Draggable
              disabled={!isMinimized}
              bounds={state.context.videoBounds}
              position={isMinimized ? undefined : { x: 0, y: 0 }}
              nodeRef={draggleRef}
              onStart={(event, uiData) => onStart(event, uiData)}
            >
              <div ref={draggleRef}>{modal}</div>
            </Draggable>
          )}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {!isMinimized && <Divider style={{ borderColor: "#9b9b9bff" }} />}
            <div
              style={{
                aspectRatio: "16 / 9",
                width: "100%",
                position: "relative",
                backgroundColor: "black",
              }}
            >
              <ReactPlayer
                src={currentVideoUrl}
                playing={state.context.isPlaying}
                controls={true}
                width="100%"
                height="100%"
                muted={false}
                loop={true}
                onPlay={() => send({ type: "PLAY" })}
                onPause={() => send({ type: "PAUSE" })}
              />
            </div>
            {!isMinimized && <Divider style={{ borderColor: "#9b9b9bff" }} />}
          </Space>
        </Modal>
      </Layout.Content>
    </Layout>
  );
}

export default App;
