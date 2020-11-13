import React from 'react'
import Nav from '../../components/Nav'
import Comments from '../../components/Comments/Comments'

export default function DiscussonPage() {
  return (
    <div>
      <Nav navName="Comments" menuButton="back" backTo="/" />
      <Comments />
    </div>
  )
}