import React, { useState, useEffect } from "react";
import QrReader from "react-qr-reader";
import { Button, FormGroup, FormControlLabel, Switch } from "@material-ui/core";
import Nav from "../components/Nav";

export default function QRScan() {
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState(null);
  const [isTorchOn, setToggleTorch] = useState(true)

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
              advanced: [{ torch: isTorchOn }]
            })
              .catch(e => {
                console.log(e)
                setError(JSON.stringify(e))
              });
          }
        }

      })
      .catch(err => {
        setError(JSON.stringify(err))
      });
  }, [isTorchOn])

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
            {error && <p className="text-center text-danger" >{error}</p>}

            <FormGroup>
              <FormControlLabel
                control={<Switch checked={isTorchOn} onChange={() => setToggleTorch(!isTorchOn)} />}
                label="Toggle Torch"
              />
            </FormGroup>
          </>
        )}
    </div>
  );
}
