import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import { useWindowDimensions } from '../utils/customHooks'

// we might need to have some loading functionality or image placeholder(skeleton)
export default function ImageAuth({ imageLink, token, className, type }) {
  console.log('got here')
    const [response, setData] = useState('')
    const { width } = useWindowDimensions()
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null)

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(imageLink, options)
        setData(result)
      } catch (err) {
        setError(err)
      }
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (type === 'image') {
    return <img src={response.url} className={className} alt="authenticated link" />
  }
  if (type === 'imageAvatar') {
    return <Avatar alt="avatar-image" src={response.url}  />
  }
  return <iframe height={600} width={width < 550 ? width - 20 : 600} title="attachment" src={response.url} />
}

ImageAuth.defaultProps = {
  className: 'img-responsive img-thumbnail',
  type: 'image'
}

ImageAuth.propTypes = {
  imageLink: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  type: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

