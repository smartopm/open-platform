import React from 'react'

export function Footer({ position }) {
  return (
    <p
      style={{
        textAlign: 'center',
        color: '#8c8c93',
        marginTop: position
      }}
      className="text-center"
    >
      Powered by DoubleGDP{' '}
    </p>
  )
}
