import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import Forms from '../components/FormList';

export default function CommunityForms({ location }) {
  const authState = useContext(Context);
  return (
    <>
      <Forms
        userType={authState?.user?.userType}
        community={authState.user?.community.name}
        location={location}
      />
    </>
  );
}

CommunityForms.defaultProps = {
  location: {}
}

CommunityForms.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.object
}
