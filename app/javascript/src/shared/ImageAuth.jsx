import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
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

    // The dummy param is a hack to prevent this caching
    // issue: (https://gitlab.com/doublegdp/app/-/issues/1921)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const result = useFetchMedia(`${imageLink}/auth?dummy=${Date.now()}`, options);
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
        src={auth ? response.url : `${imageLink}?dummy=${Date.now()}`}
        style={style}
        className={className}
        alt={alt}
      />
    );
  }
  if (type === 'imageAvatar') {
    return <Avatar alt={alt} src={auth ? response.url : `${imageLink}?dummy=${Date.now()}`} />;
  }
  return (
    <iframe
      height={600}
      width={width < 550 ? width - 20 : 600}
      title="attachment"
      src={auth ? response.url : `${imageLink}?dummy=${Date.now()}`}
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
