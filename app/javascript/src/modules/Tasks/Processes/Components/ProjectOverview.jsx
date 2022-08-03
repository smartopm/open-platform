import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography , Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { TaskContext } from '../../Context';
import { UserFormPropertiesQuery } from '../../../Forms/graphql/forms_queries';
import { Spinner } from '../../../../shared/Loading';
import { formatError } from '../../../../utils/helpers';
import MessageAlert from '../../../../components/MessageAlert';
import CenteredContent from '../../../../shared/CenteredContent';

export default function ProjectOverview({ data }) {
  const { authState, updateStatus, handleMessageAlertClose } = useContext(TaskContext);
  const { t } = useTranslation('task');
  const classes = useStyles();

  const FORM_FIELD_NAMES_TO_INCLUDE = [
    'Project Developer',
    'Project Architect',
    'Project Type',
    'Precinct / Zone',
    'Submission Date'
  ];

  const [loadFormData,
    { data: formData, error: formDataError, loading: formDataLoading }
  ] = useLazyQuery(
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

  if (formDataLoading) return <Spinner />;
  if (formDataError) return(
    <CenteredContent>{formatError(formDataError.message)}</CenteredContent>
  );

  return (
    <>
      <MessageAlert
        type={updateStatus.success ? 'success' : 'error'}
        message={updateStatus.message}
        open={!!updateStatus.message}
        handleClose={handleMessageAlertClose}
      />
      <Grid container style={{ marginLeft: '-20px' }} data-testid="project-information">
        <Grid item md={12} xs={12}>
          {formEntriesData?.length > 0 ? (
          formEntriesData.map(d => (
            <Grid
              container
              spacing={2}
              key={d.formProperty.fieldName}
              className={classes.overViewItem}
            >
              <Grid item md={5} xs={5}>
                <Typography variant="caption" color="textSecondary">
                  {d.formProperty.fieldName.replace('Project', '')}
                </Typography>
              </Grid>
              <Grid item md={7} xs={7}>
                <Typography variant="subtitle2" color="#6C6C6C" style={{ fontWeight: 400 }}>
                  {d.value}
                </Typography>
              </Grid>
            </Grid>
          ))
        ) : (
          <CenteredContent data-testid="no-project-info">{t('processes.no_form_data')}</CenteredContent>
        )}
        </Grid>
        { data?.formUser?.user && (
          <>
            <Grid container spacing={2} className={classes.overViewItem}>
              <Grid item xs={5} md={5}>
                <Typography variant="caption" color="textSecondary">
                  {t('processes.submitted_by')}
                </Typography>
              </Grid>
              <Grid item xs={7} md={7}>
                <Typography className={classes.link} variant="subtitle2" style={{ fontWeight: 400 }}>
                  {data.formUser.user?.name}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={5} md={5}>
                <Typography variant="caption" color="textSecondary">
                  {t('processes.submitted_form')}
                </Typography>
              </Grid>
              <Grid item md={7} xs={7}>
                <Button
                  href={`/user_form/${data.formUser.user.id}/${data.formUser.id}/task?formId=${data.formUser.formId}`}
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                >
                  {t('processes.open_submitted_form')}
                </Button>
              </Grid>
            </Grid>
          </>
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

ProjectOverview.defaultProps = {
  data: {},
};

ProjectOverview.propTypes = {
  data: PropTypes.shape(Step)
};

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette?.primary?.main
  },
  button: {
    padding: '2px 10px'
  },
  overViewItem: {
    marginBottom: '5px'
  }
}))
