import React, { useState } from 'react';
import QrReader from 'react-qr-reader'
import Nav from './Nav'

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
      <Nav navName="Scan" menuButton="back" />
      <QrReader
        delay={100}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      <p>{state.result}</p>
    </div>
  )

}
