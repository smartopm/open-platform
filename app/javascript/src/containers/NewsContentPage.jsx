import React from 'react'
import { useParams } from 'react-router-dom'
import IframeContainer from '../components/IframeContainer'
import { useWindowDimensions } from '../utils/customHooks'

export default function NewsContentPage() {
  const { width, height } = useWindowDimensions()
  const { link } = useParams()
  const url = `https://doublegdp.gitlab.io/nkwashi-content/${link}`
  console.log(url)
  return (
    <IframeContainer
      link={url}
      height={height}
      width={width}
    />
  )
}
