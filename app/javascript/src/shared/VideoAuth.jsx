import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../containers/Provider/AuthStateProvider';
import { useFetch } from '../utils/customHooks';

export default function VideoAuth({ src }) {
  const authState = useContext(Context);
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authState.token}`
    }
  };
  const { loading, response } = useFetch(src, options);

  console.log(response)
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video width="620" controls src="">
      Your browser is not supported
    </video>
  );
}

VideoAuth.propTypes = {
  src: PropTypes.string.isRequired
};
