import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// we might need to have some loading functionality or image placeholder(skeleton)
export default function ImageAuth({ imageLink, token, className }) {
    const [response, setData] = useState('')
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

  return <img src={response.url} className={className} alt="authenticated link" />
}

ImageAuth.defaultProps = {
  className: 'img-responsive img-thumbnail'
}

ImageAuth.propTypes = {
  imageLink: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

