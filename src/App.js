import React, { useEffect, useRef, useState } from "react";
import SimpleWebRTC from "simplewebrtc";

export default function App() {
  const [roomName, setRoomName] = useState("test-room");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const webrtc = useRef(null);

  useEffect(() => {
    if (joined) {
      webrtc.current = new SimpleWebRTC({
        localVideoEl: "",
        remoteVideosEl: "",
        autoRequestMedia: true,
        media: {
          audio: true,
          video: false
        }
      });

      webrtc.current.on("readyToCall", () => {
        webrtc.current.joinRoom(roomName);
        setMessages((msgs) => [...msgs, `Joined room: ${roomName}`]);
      });

      webrtc.current.on("createdPeer", (peer) => {
        setMessages((msgs) => [...msgs, `New peer connected: ${peer.id}`]);
      });

      webrtc.current.on("peerStreamRemoved", (peer) => {
        setMessages((msgs) => [...msgs, `Peer left: ${peer.id}`]);
      });

      webrtc.current.on("localStream", () => {
        setMessages((msgs) => [...msgs, "Local audio stream started"]);
      });

      webrtc.current.on("error", (err) => {
        setMessages((msgs) => [...msgs, `Error: ${err}`]);
      });
    }

    return () => {
      if (webrtc.current) {
        webrtc.current.stopLocalVideo();
        webrtc.current.disconnect();
        webrtc.current = null;
      }
      setMessages([]);
    };
  }, [joined, roomName]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Simple Voice Chat Room</h1>
      {!joined ? (
        <>
          <label>
            Room Name:{" "}
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              style={{ fontSize: 16 }}
            />
          </label>
          <button onClick={() => setJoined(true)} style={{ marginLeft: 10 }}>
            Rejoindre la room
          </button>
        </>
      ) : (
        <>
          <p>Vous êtes dans la room: <b>{roomName}</b></p>
          <button onClick={() => setJoined(false)}>Quitter</button>
        </>
      )}

      <div
        style={{
          marginTop: 20,
          padding: 10,
          border: "1px solid #ccc",
          height: 200,
          overflowY: "auto",
          backgroundColor: "#f9f9f9"
        }}
      >
        <h3>Messages / Statut :</h3>
        {messages.length === 0 && <p>Pas encore de messages...</p>}
        <ul>
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
