import React from 'react'
import IframeContainer from '../components/IframeContainer'
import { useWindowDimensions } from '../utils/customHooks'

export default function NewsContentPage() {
  const { width, height } = useWindowDimensions()
  return (
    <IframeContainer
      link="https://doublegdp.gitlab.io/nkwashi-content/"
      height={height}
      width={width}
    />
  )
}
