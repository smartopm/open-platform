import React, { useState, useEffect } from "react";
import QrReader from "react-qr-reader";
import { useTranslation } from "react-i18next";
import { FormControlLabel, Switch } from "@material-ui/core";
import Nav from "../components/Nav";

export default function QRScan() {
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState(null);
  const [isTorchOn, setToggleTorch] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const video = document.querySelector('video');

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
      }
    })
      .then((stream) => {
        video.srcObject = stream;

        // get the active track of the stream
        const track = stream.getVideoTracks()[0];

        video.addEventListener('loadedmetadata', () => {
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

            <div className="row justify-content-center align-items-center " style={{
              marginTop: 60
            }} >
              <FormControlLabel
                control={<Switch checked={isTorchOn} onChange={() => setToggleTorch(!isTorchOn)} />}
                label={t("scan.torch")}
              />
            </div>
          </>
        )}
    </div>
  );
}
