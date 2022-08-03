import React, { useState, useContext } from 'react';
import { Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useHistory } from 'react-router-dom';
import { formatError } from '../../../../utils/helpers';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import SpeedDial from '../../../../shared/buttons/SpeedDial';
import { accessibleMenus } from '../utils';
import { ProcessTemplatesQuery } from '../../../Processes/graphql/process_list_queries';
import ProcessListItem from './ProcessListItem';
import PageWrapper from '../../../../shared/PageWrapper';
import { Context as AuthStateProvider } from '../../../../containers/Provider/AuthStateProvider';

export default function AdminDashboard() {
  const { t } = useTranslation(['task', 'process']);
  const history = useHistory();
  const matches = useMediaQuery('(max-width:600px)');
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const authState = useContext(AuthStateProvider);

  const { data: processes, loading: processesLoading, error: processesError } = useQuery(
    ProcessTemplatesQuery,
    {
      fetchPolicy: 'cache-and-network'
    }
  );

  const processesPagePermissions = authState?.user?.permissions?.find((permission) => (
    permission.module === 'process'
  ));

  const canCreateProcess = Boolean(processesPagePermissions && processesPagePermissions.permissions?.includes('can_create_process_template'));

  const speedDialActions = [
    {
      icon: <VisibilityIcon />,
      name: t('process:templates.create_a_process'),
      handleClick: () => history.push('/processes/templates/create'),
      isVisible: true // TODO: Use permission if needed
    },
    {
      icon: <VisibilityIcon />,
      name: t('process:templates.process_templates'),
      handleClick: () => history.push('/processes/templates'),
      isVisible: true // TODO: Use permission if needed
    }
  ];

  return (
    <PageWrapper pageTitle={t('process:breadcrumbs.processes')}>
      <div data-testid="processes-admin-dashboard">
        <Grid container>
          <Grid item md={11} xs={10}>
            {!matches && (
              <>
                {processesError && (
                  <CenteredContent>{formatError(processesError.message)}</CenteredContent>
                )}
                {processesLoading ? (
                  <Spinner />
                ) : processes?.processTemplates?.length > 0 ? (
                  processes.processTemplates.map(process => (
                    <ProcessListItem key={process.id} processItem={process} />
                  ))
                ) : (
                  <CenteredContent>{t('processes.no_processes')}</CenteredContent>
                )}
              </>
            )}
          </Grid>
          {canCreateProcess && (
            <Grid item md={1} xs={2}>
              <SpeedDial
                open={openSpeedDial}
                handleSpeedDial={() => setOpenSpeedDial(!openSpeedDial)}
                actions={accessibleMenus(speedDialActions)}
                tooltipOpen
              />
            </Grid>
          )}
        </Grid>
        {matches && (
          <>
            {processesError && (
              <CenteredContent>{formatError(processesError.message)}</CenteredContent>
            )}
            {processesLoading ? (
              <Spinner />
            ) : processes?.processTemplates?.length > 0 ? (
              processes.processTemplates.map(process => (
                <ProcessListItem key={process.id} processItem={process} />
              ))
            ) : (
              <CenteredContent>{t('processes.no_processes')}</CenteredContent>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
