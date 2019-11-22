import React, { useState, useEffect } from "react";
import QrReader from "react-qr-reader";
import Nav from "../components/Nav";

export default function QRScan() {
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
      }
    })
      .then((stream) => {
        const video = document.querySelector('video');
        video.srcObject = stream;

        // get the active track of the stream
        const track = stream.getVideoTracks()[0];

        video.addEventListener('loadedmetadata', (e) => {
          window.setTimeout(() => (
            onCapabilitiesReady(track.getCapabilities())
          ), 500);
        });

        function onCapabilitiesReady(capabilities) {
          if (capabilities.torch) {
            track.applyConstraints({
              advanced: [{ torch: true }]
            })
              .catch(e => console.log(e));
          }
        }

      })
      .catch(err => console.error('getUserMedia() failed: ', err));
  })

  const handleScan = data => {
    if (data) {
      setScanned(true);
      window.location = data;
    }
  };


  const handleError = err => {
    console.error(err);
  };

  return (
    <div>
      <Nav navName="Scan" menuButton="back" />

      {scanned ? (
        <h1 className="text-center">Decoding...</h1>
      ) : (
          <>
            <video style={{
              display: "none"
            }}></video>
            <QrReader
              delay={100}
              torch={true}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />

          </>
        )}
    </div>
  );
}
