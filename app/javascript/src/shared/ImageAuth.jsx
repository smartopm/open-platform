import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import { useFetchMedia, useWindowDimensions } from '../utils/customHooks';
import { Spinner } from './Loading';
import { Context } from '../containers/Provider/AuthStateProvider';

export default function ImageAuth({ imageLink, className, type, alt, style, auth }) {
  const authState = useContext(Context);
  const { width } = useWindowDimensions();

  let isError;
  let loading;
  let response;
  if (auth) {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const result = useFetchMedia(`${imageLink}/auth`, options);
    isError = result.isError;
    loading = result.loading;
    response = result.response;

    if (loading) return <Spinner />;
    if (!imageLink || isError) {
      return <img src="" className={className} alt={alt} data-testid="default_image" />;
    }
  }

  if (type === 'image') {
    return (
      <img
        data-testid="authenticated_image"
        src={auth ? response.url : imageLink}
        style={style}
        className={className}
        alt={alt}
      />
    );
  }
  if (type === 'imageAvatar') {
    return <Avatar alt={alt} src={auth ? response.url : imageLink} data-testid="authenticated_avatar" />;
  }
  return (
    <iframe
      height={600}
      width={width < 550 ? width - 20 : 600}
      title="attachment"
      src={auth ? response.url : imageLink}
      data-testid="authenticated_file"
    />
  );
}

ImageAuth.defaultProps = {
  className: 'img-responsive img-thumbnail',
  type: 'image',
  alt: 'authenticated link',
  style: {},
  auth: false
};

ImageAuth.propTypes = {
  imageLink: PropTypes.string.isRequired,
  type: PropTypes.string,
  alt: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  auth: PropTypes.bool
};
