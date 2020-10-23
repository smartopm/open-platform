/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// we might need to have some loading functionality or image placeholder(skeleton)
export default function ImageAuth({ imageLink, token }) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const source = useFetch(imageLink, options)
  return <img src={source.response.url} className="img-responsive img-thumbnail" alt="authenticated link" />
}

ImageAuth.propTypes = {
  imageLink: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
}

export function useFetch(url, options) {
  const [response, setData] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(url, options)
        setData(result)
      } catch (err) {
        setError(err)
      }
    }
    fetchData()
  })
  return { response, error }
}
