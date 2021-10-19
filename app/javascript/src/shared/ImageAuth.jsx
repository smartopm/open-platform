import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import { useWindowDimensions } from '../utils/customHooks'
import { Spinner } from './Loading'

// we might need to have some loading functionality or image placeholder(skeleton)
export default function ImageAuth({ imageLink, token, className, type, alt, style }) {
    const [response, setData] = useState('')
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

  if(isLoading) return <Spinner />
  if(!imageLink || isError) return <span />
  if (type === 'image') {
    return <img data-testid="authenticated_image" src={response.url} style={style} className={className} alt={alt} />
  }
  if (type === 'imageAvatar') {
    return <Avatar alt={alt} src={response.url}  />
  }
  return <iframe height={600} width={width < 550 ? width - 20 : 600} title="attachment" src={response.url} />
}

ImageAuth.defaultProps = {
  className: 'img-responsive img-thumbnail',
  type: 'image',
  alt: 'authenticated link',
  style: {}
}

ImageAuth.propTypes = {
  imageLink: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  type: PropTypes.string,
  alt: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

