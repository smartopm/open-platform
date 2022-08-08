/* eslint-disable max-statements */
import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { Grid, Typography, TextField, Modal, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useHistory, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { formatError, useParamsQuery } from '../../../../utils/helpers';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';
import { ProjectsQuery } from '../graphql/process_queries';
import ProjectItem from './ProjectItem';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import Paginate from '../../../../components/Paginate';
import SpeedDial from '../../../../shared/buttons/SpeedDial';
import { accessibleMenus } from '../utils';
import PageWrapper from '../../../../shared/PageWrapper';

export default function ProjectsList() {
  const { id: processId } = useParams();
  const { t } = useTranslation(['task', 'common']);
  const limit = 50;
  const [offset, setOffset] = useState(0);
  const path = useParamsQuery();
  const processName = path.get('process_name');
  const history = useHistory();
  const currentStep = path.get('current_step')
  const completedPerQuarter = path.get('completed_per_quarter')
  const submittedPerQuarter = path.get('submitted_per_quarter')
  const lifeTimeCategory = path.get('life_time_totals')
  const repliesRequestedStatus = path.get('replies_requested')
  const classes = useStyles();
  const authState = React.useContext(AuthStateContext);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const matches = useMediaQuery('(max-width:600px)');

  const speedDialActions = [
    {
      icon: <VisibilityIcon />,
      name: t('project.add_new_project'),
      handleClick: () => setModalOpen(true),
      isVisible: true,
    },
    {
      icon: <VisibilityIcon />,
      name: t('project.edit_template'),
      handleClick: () => handleEditProjectTemplate(),
      isVisible: true,
    },
  ];

  const { loading, error, data, refetch }
    = useQuery(ProjectsQuery, {
    variables: {
      offset,
      limit,
      processId,
      step: currentStep,
      completedPerQuarter,
      submittedPerQuarter,
      lifeTimeCategory,
      repliesRequestedStatus
    },
    fetchPolicy: 'cache-and-network'
  });

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return;
      }
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  function handleEditProjectTemplate() {
    history.push({
      pathname: '/processes/templates/edit',
      state: { process: history.location.state.process }
    });
  }

  function dynamicFormUrl(){
    const { state } = history.location;
    const formId = state?.process?.form?.id;

    const url = `${window.location.origin}/form/${formId}`

    return url
  }

  const breadCrumbObj = {
    linkText: t('processes.processes'),
    linkHref: '/processes',
    pageName: processName
  }

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  return (
    <PageWrapper pageTitle={processName} breadCrumbObj={authState.user.userType === 'admin' ? breadCrumbObj : undefined}>
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open={modalOpen}
        aria-labelledby="server-modal-title"
        aria-describedby="server-modal-description"
        className={classes.modal}
        data-testid="new-project-modal"
      >
        <Grid container spacing={1} className={matches ? classes.paperMobile : classes.paper}>
          <Grid item md={12} xs={12}>
            <Typography variant="h6" color="text.primary">
              {t('project.add_new_project')}
            </Typography>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography>{t('project.new_project_description')}</Typography>
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              label="Form Link"
              type="text"
              onChange={() => {}}
              value={dynamicFormUrl()}
              name="formLink"
              inputProps={{ 'data-testid': 'formLink' }}
            />
          </Grid>
          <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              data-testid="close_project_modal"
              onClick={() => setModalOpen(false)}
            >
              {t('common:misc.close')}
            </Button>
          </Grid>
        </Grid>
      </Modal>
      <div>
        <Grid container>
          <Grid item md={11} xs={10} className={classes.header} />
          <Grid
            item
            md={1}
            xs={2}
            data-testid="new-project-speed-dial"
            style={{ marginTop: '-30px' }}
          >
            <SpeedDial
              open={openSpeedDial}
              handleSpeedDial={() => setOpenSpeedDial(!openSpeedDial)}
              actions={accessibleMenus(speedDialActions)}
            />
          </Grid>
        </Grid>
        {loading && <Spinner />}
        {data?.projects?.length ? (
          <div style={{marginTop: '30px'}}>
            {data.projects.map(task => (
              <div key={task.id}>
                <ProjectItem
                  processId={processId}
                  task={task}
                  refetch={refetch}
                  processName={processName}
                />
              </div>
            ))}
          </div>
        ) : (
          !loading && <CenteredContent>{t('processes.no_projects')}</CenteredContent>
        )}
        <br />
        <CenteredContent>
          <Paginate
            count={data?.projects?.length}
            offSet={offset}
            limit={limit}
            active={offset >= 1}
            handlePageChange={paginate}
          />
        </CenteredContent>
      </div>
    </PageWrapper>
  );
}

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: '10px'
  },

  paperMobile: {
    width: '100%',
    height: "100%",
    backgroundColor: "#ffffff",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4),
  },
  paper: {
    width: '50%',
    height: "60%",
    backgroundColor: "#ffffff",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4),
  },

  modal: {
    display: "flex",
    alignItems: "center",
    overflow:'scroll',
    justifyContent: "center",
    userSelect: 'none',
    "-webkit-user-select": " none",
    "-webkit-touch-callout": " none",
    "-ms-user-select": " none",
    "-moz-user-select": "none",
  },
}));
