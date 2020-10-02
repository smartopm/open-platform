import React from 'react'
import PostsList from '../../components/NewsPage/PostList'
import Nav from '../../components/Nav'

export default function Posts() {
    return (
      <>
        <Nav navName="Nkwashi News" menuButton="back" backTo="/" />
        <PostsList />
      </>
    )
}
