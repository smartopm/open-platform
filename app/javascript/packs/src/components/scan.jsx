import React, { useState } from 'react';
import QrReader from 'react-qr-reader'

export default function QRScan() {
  const initialState = {
    result: '',
  }

  const [state, setState] = useState(initialState)

  const handleScan = data => {
    if (data) {
      // For now, just send us to the URL
      console.log(data)
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
