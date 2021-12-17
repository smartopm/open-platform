import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import { useFetchMedia, useWindowDimensions } from '../utils/customHooks'
import { Spinner } from './Loading'
import { Context } from '../containers/Provider/AuthStateProvider'

export default function ImageAuth({ imageLink, className, type, alt, style }) {
    const authState = useContext(Context)
    const { width } = useWindowDimensions()
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authState.token}`,
        'Cache-Control': 'no-store'
      }
    }
    const { response, isError, loading } = useFetchMedia(imageLink, options)


  if(loading) return <Spinner />
  if(!imageLink || isError) {
   return (
     <img
       src=''
       className={className}
       alt={alt}
       data-testid="default_image"
     />
   )
  }
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
  type: PropTypes.string,
  alt: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}
