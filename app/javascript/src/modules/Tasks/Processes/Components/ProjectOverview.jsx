import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useLazyQuery } from 'react-apollo';
import { TaskContext } from '../../Context';
import ProjectSteps from './Steps';
import { UserFormPropertiesQuery } from '../../../Forms/graphql/forms_queries';
import Loading from '../../../../shared/Loading';
import ErrorPage from '../../../../components/Error';
import MessageAlert from '../../../../components/MessageAlert';
import CenteredContent from '../../../../shared/CenteredContent';

export default function ProjectOverview({ data }) {
  const { authState, updateStatus, handleMessageAlertClose } = useContext(TaskContext);

  const FORM_FIELD_NAMES_TO_INCLUDE = [
    'Project Developer',
    'Project Architect',
    'Project Type',
    'Precinct / Zone',
    'Submission Date'
  ];

  const [loadFormData, { data: formData, formDataError, formDataLoading }] = useLazyQuery(
    UserFormPropertiesQuery,
    {
      variables: { userId: authState.user.id, formUserId: data?.formUserId },
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  );

  const formEntriesData = formData?.formUserProperties?.filter(f =>
    FORM_FIELD_NAMES_TO_INCLUDE.includes(f.formProperty.fieldName)
  );
  const descriptionData = formData?.formUserProperties?.find(
    f => f.formProperty.fieldName === 'Project Description'
  );

  useEffect(() => {
    if (data?.formUserId) {
      loadFormData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.formUserId]);

  if (formDataLoading) return <Loading />;
  if (formDataError) return <ErrorPage title={formDataError.message} />;

  return (
    <>
      <MessageAlert
        type={updateStatus.success ? 'success' : 'error'}
        message={updateStatus.message}
        open={!!updateStatus.message}
        handleClose={handleMessageAlertClose}
      />
      <Grid container style={{ marginLeft: '-20px' }} data-testid="project-information">
        {formEntriesData?.length ? (
          formEntriesData.map(d => (
            <Grid container spacing={10} key={d.formProperty.fieldName}>
              <Grid item md={4} xs={5}>
                <Typography variant="caption" color="textSecondary">
                  {d.formProperty.fieldName.replace('Project', '')}
                </Typography>
              </Grid>
              <Grid item md={8} xs={7}>
                <Typography variant="subtitle2" color="#6C6C6C" style={{ fontWeight: 400 }}>
                  {d.value}
                </Typography>
              </Grid>
            </Grid>
          ))
        ) : (
          <CenteredContent data-testid="no-project-info">No Project Information</CenteredContent>
        )}
        {descriptionData && (
          <Grid container spacing={1} style={{ marginTop: '32px' }}>
            <Grid item md={12} xs={12}>
              <Typography variant="subtitle1">Description</Typography>
            </Grid>
            <Grid item md={12} xs={12} color="#6C6C6C">
              <Typography variant="subtitle2" style={{ fontWeight: 400 }}>
                {descriptionData.value}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
}

export function ProjectOverviewSplitView({ data, refetch }) {
  const { setSelectedStep, handleStepCompletion } = useContext(TaskContext);

  return (
    <>
      <Grid container>
        <Grid item md={12} data-testid="requirements-section">
          <Typography variant="subtitle1" style={{fontWeight: 400}}>Requirements</Typography>
          <Typography variant="caption">Please read the required guideline. </Typography>
          <Link to="https://tilisi.doublegdp.com/news/post/8">
            <Typography variant="caption">Go to Guideline.</Typography>
          </Link>
        </Grid>
        <Grid item md={12}>
          <br />
          <br />
          <br />
          <ProjectSteps
            data={data}
            setSelectedStep={setSelectedStep}
            handleStepCompletion={(id, completed) => handleStepCompletion(id, completed, refetch)}
            redirect
          />
        </Grid>
      </Grid>
    </>
  );
}

const Step = {
  id: PropTypes.string,
  body: PropTypes.string,
  completed: PropTypes.bool,
  author: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string
  }),
  assignees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  ),
  subTasks: PropTypes.arrayOf(PropTypes.object),
  dueDate: PropTypes.string,
  formUserId: PropTypes.string
};
ProjectOverview.defaultProps = {};

ProjectOverview.propTypes = {
  data: PropTypes.shape(Step).isRequired
};

ProjectOverviewSplitView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(Step)).isRequired,
  refetch: PropTypes.func.isRequired
};
