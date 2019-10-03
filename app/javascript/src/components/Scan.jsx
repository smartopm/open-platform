import React, { useState } from 'react';
import QrReader from 'react-qr-reader'

export default function QRScan() {
  const initialState = {
    result: '',
  }

  const [state] = useState(initialState)

  const handleScan = data => {
    if (data) {
      window.location = data
    }
  }

  const handleError = err => {
    console.error(err)
  }

  return (
    <div>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      <p>{state.result}</p>
    </div>
  )

}
