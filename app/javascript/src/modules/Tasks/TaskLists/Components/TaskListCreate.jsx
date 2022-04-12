import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Breadcrumbs, Grid, Typography, Button, useMediaQuery } from '@mui/material';
import { useMutation } from 'react-apollo';

import { Link } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { CreateTaskList } from '../graphql/task_list_mutation';
import CenteredContent from '../../../../shared/CenteredContent';
import { formatError } from '../../../../utils/helpers';
import { Spinner } from '../../../../shared/Loading';
import TodoItem from '../../Components/TodoItem';

export default function TaskLists() {
  const { t } = useTranslation('task');
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width:800px)');
  const [body, setBody] = useState('');

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [errors, setErr] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [createTaskList] = useMutation(CreateTaskList);
  const [parentTaskData, setParentTaskData] = useState(null);

  function handleChange(event) {
    setDisabled(false);
    setBody(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setLoadingStatus(true);

    createTaskList({
      variables: {
        body
      }
    })
      .then(data => {
        setParentTaskData(data?.data?.taskListCreate?.note);
        setLoadingStatus(false);
        setDisabled(true);
      })
      .catch(err => {
        setDisabled(true);
        setErr(err);
      });
  }
  useEffect(() => {}, [parentTaskData]);

  if (loadingStatus) return <Spinner />;
  if (errors) return <CenteredContent>{formatError(errors.message)}</CenteredContent>;

  return (
    <div className="container">
      <Grid container spacing={1}>
        <Grid item md={12} xs={12} style={{ paddingleft: '10px' }}>
          <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb" style={{ paddingBottom: '10px' }}>
              <Link to="/tasks/task_lists">
                <Typography color="primary" style={{ marginLeft: '5px' }}>
                  {t('task_lists.task_lists')}
                </Typography>
              </Link>
              <Typography color="text.primary">{t('task_lists.configure_task_list')}</Typography>
            </Breadcrumbs>
          </div>
        </Grid>
        <Grid item md={12} xs={11} className={classes.header}>
          <Grid container spacing={1}>
            <Grid item md={9} xs={10}>
              <Typography variant="h4" style={{ marginLeft: '5px', marginBottom: '24px' }}>
                {t('task_lists.configure_task_list')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {parentTaskData === null && (
          <Grid item md={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                    <Typography variant="body1">{t('task_lists.step_1')}</Typography>
                  </Grid>
                  <Grid item md={12} xs={12} style={{ paddingTop: 0 }}>
                    <TextField
                      name="body"
                      label={t('task_lists.task_list_name')}
                      style={{ width: '100%' }}
                      onChange={handleChange}
                      value={body || ''}
                      variant="outlined"
                      fullWidth
                      size="small"
                      margin="normal"
                      inputProps={{
                        'aria-label': 'jobsCreated',
                        style: { fontSize: '15px' }
                      }}
                      InputLabelProps={{ style: { fontSize: '12px' } }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} xs={12}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    style={{ marginLeft: isMobile ? 80 : 15, marginTop: !isMobile && 42 }}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={disabled}
                      color="primary"
                      aria-label="lead_management_button"
                      data-testid="lead_management_button"
                      onClick={handleSubmit}
                    >
                      {t('task_lists.save')}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}

        <br />
        <br />
        {parentTaskData !== null ? (
          <div>
            <Grid item md={12} xs={12}>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <Typography variant="body1">{t('task_lists.step_2')}</Typography>
                </Grid>
                <Grid item md={12} xs={12} style={{ marginBottom: 10 }}>
                  <Typography variant="body2">{t('task_lists.step_2_sub_header')}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <TodoItem key={parentTaskData?.id} task={parentTaskData} taskId={parentTaskData.id} />
          </div>
        ) : (
          <CenteredContent>{t('task_lists.no_task_lists')}</CenteredContent>
        )}
      </Grid>
    </div>
  );
}

const useStyles = makeStyles({
  header: {
    marginBottom: '10px'
  }
});
