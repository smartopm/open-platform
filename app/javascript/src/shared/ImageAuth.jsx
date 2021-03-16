import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import { useWindowDimensions } from '../utils/customHooks'
import { Spinner } from './Loading'
import { CurrentCommunityQuery } from '../graphql/queries/community'
import colors from '../themes/nkwashi/colors'

// we might need to have some loading functionality or image placeholder(skeleton)
export default function ImageAuth({ imageLink, token, className, type, alt }) {
    const [response, setData] = useState('')
    const { data, error, loading} = useQuery(CurrentCommunityQuery)
    const { width } = useWindowDimensions()
    const [isError, setError] = useState(false)
    const [isLoading, setLoading] = useState(false)

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const result = await fetch(imageLink, options)
        setData(result)
        setLoading(false)
      } catch (err) {
        setError(true)
        setLoading(false)
      }
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if(isLoading || loading) return <Spinner />
  if(!loading && !error && !imageLink || isError) return <span data-testid="community_name" style={{ color: colors.textColor }}>{data?.currentCommunity.name}</span>
  if (type === 'image') {
    return <img src={response.url} className={className} alt={alt} />
  }
  if (type === 'imageAvatar') {
    return <Avatar alt="avatar-image" src={response.url}  />
  }
  return <iframe height={600} width={width < 550 ? width - 20 : 600} title="attachment" src={response.url} />
}

ImageAuth.defaultProps = {
  className: 'img-responsive img-thumbnail',
  type: 'image',
  alt: 'authenticated link'
}

ImageAuth.propTypes = {
  imageLink: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  type: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

