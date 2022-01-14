import React from 'react';
import { useHistory } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ProjectsList from './ProjectsList';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';

export default function ProcessesPage() {
  const authState = React.useContext(AuthStateContext);
  const history = useHistory();
  const processesDashboardPermissions = authState?.user?.permissions?.find((permission) => (
    permission.module === 'dashboard'
  ));

  const allowedCommunities = ['Tilisi', 'DoubleGDP', 'Nkwashi'];
  const communityCanViewDashboard = allowedCommunities.includes(authState?.user?.community?.name)

  const canAccessAdminProcessesDashboard = processesDashboardPermissions ? processesDashboardPermissions.permissions.includes('can_access_admin_processes_dashboard') : false
  if(!communityCanViewDashboard) {
    history.push('/')
  }
  return(
    <>
      {canAccessAdminProcessesDashboard ? <AdminDashboard /> : <ProjectsList />}
    </>
  );
};
