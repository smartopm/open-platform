import React, { useState } from "react";
import QrReader from "react-qr-reader";
import Nav from "../components/Nav";

export default function QRScan() {
  const [scanned, setScanned] = useState(false);

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
        <QrReader
          delay={100}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
      )}
    </div>
  );
}
