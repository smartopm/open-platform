import React from 'react'
import { wordpressEndpoint } from '../../../utils/constants'
import { useFetch } from '../../../utils/customHooks'
import Categories from './Categories'
import PostContent from './PostContent'
import { ShareButton } from '../../../components/ShareButton'
import { Spinner } from '../../../shared/Loading'

export default function NewsPage() {
    const { response, error } = useFetch(`${wordpressEndpoint}/posts/?category=news`)
    const location = window.location.href
    if (error) {
        return error.message
    }
    if (!response || !response.found) {
        return <Spinner />
    }
    return (
      <>
        <Categories />
        <PostContent response={response.posts[0]} />
        <ShareButton url={location} />
      </>
    )
}