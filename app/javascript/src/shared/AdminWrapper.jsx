import React, { useContext } from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { Context } from '../containers/Provider/AuthStateProvider';

/*
    because of dynamic rendering of all future modules, handling authorization from the routes wont be easy
    this is a better option in case in the future we need to pass any thing specific to admins we can do something like this
    then we can access that value in any component that is wrapped in AdminWrapper
    return props.children(value) and access it like this 
    ==> we might also change the way we are handling the admin authorization
    <AdminWrapper>
        {value => <>{value}</>}
    </AdminWrapper>
*/
export default function AdminWrapper(props) {
  const authState = useContext(Context);
  if (authState.user.userType !== 'admin') {
    return <Redirect to="/" />;
  }
  return props.children;
}

AdminWrapper.propTypes = {
  /**
   *  This has to be a ReactNode that is only accessible by an admin
   * */
  children: PropTypes.node.isRequired
};
