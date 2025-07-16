import React, { useState } from "react";

const MeetingDashboard = () => {
  const [meetingStarted, setMeetingStarted] = useState(false);

  const handleStartMeeting = () => {
    setMeetingStarted(true);
  };

  return (
    <div className="meeting-dashboard-container">
      <h2>Virtual Consultation Room</h2>
      {!meetingStarted ? (
        <>
          <p>Click the button below to join the meeting.</p>
          <button onClick={handleStartMeeting}>Join Meeting</button>
        </>
      ) : (
        <div className="video-container">
          {/* Placeholder for video call */}
          <p>Meeting in progress... (video will appear here)</p>
          <iframe
            src="https://meet.jit.si/medconnect-demo-room"
            title="Video Conference"
            allow="camera; microphone; fullscreen"
            style={{ width: "100%", height: "500px", border: "none" }}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default MeetingDashboard;
