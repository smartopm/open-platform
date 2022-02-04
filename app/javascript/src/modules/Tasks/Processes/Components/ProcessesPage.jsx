import React from 'react';
import { useHistory } from 'react-router-dom';
import TaskContextProvider from '../../Context';
import AdminDashboard from './AdminDashboard';
import ClientPilotViewList from './ClientPilotViewList';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import ProjectsList from './ProjectsList';

export default function ProcessesPage() {
  const authState = React.useContext(AuthStateContext);
  const history = useHistory();
  const processesDashboardPermissions = authState?.user?.permissions?.find((permission) => (
    permission.module === 'dashboard'
  ));

  const allowedCommunities = ['Tilisi', 'DoubleGDP'];
  const communityCanViewDashboard = allowedCommunities.includes(authState?.user?.community?.name)

  const canAccessAdminProcessesDashboard = processesDashboardPermissions ? processesDashboardPermissions.permissions.includes('can_access_admin_processes_dashboard') : false
  const canAccessClientProcessesDashboard = processesDashboardPermissions ? processesDashboardPermissions.permissions.includes('can_access_client_processes_dashboard') : false
  if(!communityCanViewDashboard) {
    history.push('/')
  }
  return(
    <TaskContextProvider>
      {
      // eslint-disable-next-line no-nested-ternary
      canAccessAdminProcessesDashboard ? <AdminDashboard /> : canAccessClientProcessesDashboard ? <ClientPilotViewList /> : <ProjectsList />
      }
    </TaskContextProvider>
  );
};
