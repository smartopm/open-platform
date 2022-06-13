import React from 'react';
import { useHistory } from 'react-router-dom';
import TaskContextProvider from '../../Context';
import AdminDashboard from './AdminDashboard';
import ClientPilotViewList from './ClientPilotViewList';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';

export default function ProcessesPage() {
  const authState = React.useContext(AuthStateContext);
  const history = useHistory();
  const processesDashboardPermissions = authState?.user?.permissions?.find((permission) => (
    permission.module === 'dashboard'
  ));

  const canAccessAdminProcessesDashboard = processesDashboardPermissions ? processesDashboardPermissions.permissions.includes('can_access_admin_processes_dashboard') : false
  const canAccessClientProcessesDashboard = processesDashboardPermissions ? processesDashboardPermissions.permissions.includes('can_access_client_processes_dashboard') : false

  // TODO: This should be re-written, a component should always be a component
  function renderDashboard() {
    if (canAccessAdminProcessesDashboard) return <AdminDashboard />;
    if (canAccessClientProcessesDashboard) return  <ClientPilotViewList />;
    return history.push('/');
  }

  return(
    <TaskContextProvider>
      {renderDashboard() || <></>}
    </TaskContextProvider>
  );
};
