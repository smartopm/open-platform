import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../containers/Provider/AuthStateProvider';
import { useFetchMedia } from '../utils/customHooks';

export default function VideoAuth({ src }) {
  const authState = useContext(Context);
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authState.token}`
    }
  };
  const { response, } = useFetchMedia(src, options);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video width="100%" controls src={response.url}>
      Your browser is not supported
    </video>
  );
}

VideoAuth.propTypes = {
  src: PropTypes.string.isRequired
};
