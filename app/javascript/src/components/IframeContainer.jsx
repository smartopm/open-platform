import React from 'react'

export default function IframeContainer({ link, height, width }) {
  return (
    <div>
      <iframe src={link} height={height} width={width} />
    </div>
  )
}
