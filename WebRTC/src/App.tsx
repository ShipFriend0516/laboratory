import {useRef, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
    const [callButtonActive, setCallButtonActive] = useState(false)
    const [hangupButtonActive, setHangupButtonActive] = useState(false)
    const [startButtonActive, setStartButtonActive] = useState(true)
    const [status, setStatus] = useState('연결 대기중')

    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    // WebRTC 설정
    const configuration = {
        iceServers: [{
            urls: 'stun:stun.l.google.com:19302'
        }]
    };

    // 변수 선언

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);



    // 미디어 스트림 시작
    async function startCall() {
        try {
            console.log(navigator.mediaDevices.getUserMedia(
                {video: true}
            ))
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if(localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                localStream = stream;
            }

            setStartButtonActive(false);
            setCallButtonActive(true);
            setStatus('P2P 연결 시작 중...')
        } catch (e) {
            console.error('미디어 스트림 획득 실패:', e);
            setStatus('카메라/마이크 접근 실패')

        }
    }

    // 연결 시작
    async function call() {
      setCallButtonActive(false);
        setHangupButtonActive(true);
        setStatus('P2P 연결 시작 중...');

        try {
           setPeerConnection(new RTCPeerConnection(configuration))


            // 스트림 추가

            localStream!.getTracks().forEach(track => {
                peerConnection!.addTrack(track, localStream!);
            });

            // 원격 스트림 처리
            peerConnection!.ontrack = event => {
              if(remoteVideoRef.current) {
                remoteVideoRef.current!.srcObject = event.streams[0];
               setRemoteStream(event.streams[0])
              }
            };

            // ICE 후보 처리
            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    // 실제 구현에서는 시그널링 서버를 통해 전송
                    console.log('ICE candidate:', event.candidate);
                }
            };

            // 연결 상태 변경 처리
            peerConnection.oniceconnectionstatechange = () => {
               setStatus('연결 상태: ' + peerConnection.iceConnectionState);
            };

            // Offer 생성 (발신측)
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            // 여기서 실제로는 시그널링 서버를 통해 offer를 전송
            console.log('Offer:', offer);

            // 데모를 위해 자동으로 answer 생성 (수신측 역할)
            await handleOffer(offer);

        } catch (e) {
            console.error('연결 실패:', e);
            setStatus('연결 실패');
        }
    }

    // Offer 처리 (수신측)
    async function handleOffer(offer) {
        try {
            await peerConnection.setRemoteDescription(offer);
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            // 여기서 실제로는 시그널링 서버를 통해 answer를 전송
            console.log('Answer:', answer);

            // 데모를 위해 직접 answer 처리
            await peerConnection.setRemoteDescription(answer);
        } catch (e) {
            console.error('Answer 생성 실패:', e);
        }
    }

    // 연결 종료
    function hangup() {
        if (peerConnection) {
            peerConnection.close();
            peerConnection = null;
        }

        localStream.getTracks().forEach(track => track.stop());

        if(localVideoRef.current) {
             localVideoRef.current.srcObject = null;
        }

        if(remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }


        setStartButtonActive(true);
        setCallButtonActive(false)
        setHangupButtonActive(false);
        setStatus('연결 종료됨');
    }

  return (
      <>
          <div className="videos">
              <video ref={localVideoRef} id="localVideo" autoPlay playsInline muted></video>
              <video ref={remoteVideoRef} id="remoteVideo" autoPlay playsInline></video>
          </div>
          <div>
              <button id="startButton" onClick={startCall} disabled={!startButtonActive}>Start</button>
              <button id="callButton" onClick={call} disabled={!callButtonActive}>Call</button>
              <button id="hangupButton" onClick={hangup} disabled={!hangupButtonActive}>Hang Up</button>
          </div>
          <div id="connectionStatus">{status}</div>
      </>
  )
}

export default App
