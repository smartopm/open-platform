import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import UserForm from '../Components/UserForm';

export default function UserEdit() {
  const location = useLocation();

  const { pathname } = location;

  const isFromRef = pathname.includes('/referral');
  const isEditing = pathname.includes('edit');
  const authState = useContext(Context);
  const isAdminOrMarketingAdmin = authState.user.roleName === 'Admin' || 'Marketing Admin';

  return (
    <UserForm
      isEditing={isEditing}
      isFromRef={isFromRef}
      isAdminOrMarketingAdmin={isAdminOrMarketingAdmin}
    />
  );
}

UserEdit.propTypes = {
  // commented as its not passed as prop
  // location: PropTypes.shape({
  //   pathname: PropTypes.string
  // }).isRequired
};
