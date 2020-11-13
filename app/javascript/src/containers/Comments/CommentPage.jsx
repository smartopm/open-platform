import React from 'react'
import Nav from '../../components/Nav'
import { CommentsPostQuery } from '../../graphql/queries'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import Comments from '../../components/Comments/Comments'

export default function DiscussonPage() {

    return (
      <div>
        <Nav navName="Comments" menuButton="back" backTo="/" />
        <Comments />
      </div>
    )
}