import { useEffect } from "react";

const ZegoCall = () => {
  useEffect(() => {
    const roomID = new URLSearchParams(window.location.search).get("roomID") || Math.floor(Math.random() * 10000).toString();
    const userID = Math.floor(Math.random() * 10000).toString();
    const userName = "userName" + userID;
    const appID = 1622896018;
    const serverSecret = "d1aca3225a6c2beb1cee97e67bfe71f2";
    const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);

    const zp = window.ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: document.querySelector("#zego-container"),
      sharedLinks: [{
        name: 'Personal link',
        url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
      }],
      scenario: {
        mode: window.ZegoUIKitPrebuilt.VideoConference,
      },
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTextChat: true,
      showUserList: true,
      maxUsers: 2,
      layout: "Auto",
      showLayoutButton: false,
    });

    // CLEANUP on unmount
    return () => {
      zp.destroy(); // <--- This is crucial!
    };
  }, []);

  return <div id="zego-container" style={{ width: "100vw", height: "100vh" }}></div>;
};

export default ZegoCall;
