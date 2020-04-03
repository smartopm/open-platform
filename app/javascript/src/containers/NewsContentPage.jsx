import React from 'react'
import { useParams } from 'react-router-dom'
import IframeContainer from '../components/IframeContainer'
import { useWindowDimensions } from '../utils/customHooks'

export default function NewsContentPage() {
  const { width, height } = useWindowDimensions()
  const currentUrl = window.location.href 
  const url = `https://doublegdp.gitlab.io/nkwashi-content/${formatUrl(currentUrl, 'news') || ''}`

  return (
    <IframeContainer
      link={url}
      height={height}
      width={width}
    />
  )
}

function formatUrl(url, tag){
  const urlContents = url.split('/')
  // find index of the tag, in this case our news item
  const tagIndex = urlContents.findIndex(item => item === tag )
  // return the combined array after the found index
  return urlContents.slice(tagIndex + 1).join('/')
}
