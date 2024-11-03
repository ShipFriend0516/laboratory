import { useRef, useState } from 'react';
import * as icons from 'react-icons/fa6';
import './App.css';

function App() {
  const [startButtonActive, setStartButtonActive] = useState(true);
  const [status, setStatus] = useState('연결 대기중');

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  // WebRTC 설정

  console.log(icons);
  // 변수 선언

  // 미디어 스트림 시작
  async function startCall() {
    try {
      console.log(navigator.mediaDevices.getUserMedia({ video: true }));
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setStartButtonActive(false);
      setStatus('P2P 연결 시작 중...');
    } catch (e) {
      console.error('미디어 스트림 획득 실패:', e);
      setStatus('카메라/마이크 접근 실패');
    }
  }

  return (
    <>
      <div className="videos">
        <video
          ref={localVideoRef}
          id="localVideo"
          autoPlay
          playsInline
          muted
        ></video>
        <video
          ref={remoteVideoRef}
          id="remoteVideo"
          autoPlay
          playsInline
        ></video>
      </div>
      <div>
        <button
          id="startButton"
          onClick={startCall}
          disabled={!startButtonActive}
        >
          Start
        </button>
      </div>
      <div id="connectionStatus">{status}</div>
    </>
  );
}

export default App;
