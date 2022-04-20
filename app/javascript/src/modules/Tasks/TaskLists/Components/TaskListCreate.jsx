import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Link, useHistory } from 'react-router-dom';
import { Breadcrumbs, Grid, Typography, Button, useMediaQuery } from '@mui/material';
import { useMutation } from 'react-apollo';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { CreateTaskList } from '../graphql/task_list_mutation';
import CenteredContent from '../../../../shared/CenteredContent';
import { formatError } from '../../../../utils/helpers';
import { Spinner } from '../../../../shared/Loading';
import useStateIfMounted from '../../../../shared/hooks/useStateIfMounted';

export default function TaskListCreate() {
  const { t } = useTranslation('task');
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width:800px)');
  const [body, setBody] = useState('');
  const [loadingStatus, setLoadingStatus] = useStateIfMounted(false);
  const [errors, setErr] = useState('');
  const [createTaskList] = useMutation(CreateTaskList);
  const [parentTaskData, setParentTaskData] = useStateIfMounted(null);
  const history = useHistory();

  function handleChange(event) {
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
        history.push(`/tasks/task_lists/${data?.data?.taskListCreate?.note?.id}`);
        setLoadingStatus(false);
      })
      .catch(err => {
        setErr(err);
      });
  }
  useEffect(() => {
    const unMount = () => {};

    return unMount;
  }, []);

  if (loadingStatus) return <Spinner />;
  if (errors) return <CenteredContent>{formatError(errors.message)}</CenteredContent>;

  return (
    <div className="container">
      <Grid container spacing={1}>
        <Grid item md={12} xs={12} style={{ paddingleft: '10px' }}>
          <div role="presentation">
            <Breadcrumbs
              aria-label="breadcrumb"
              style={{ paddingBottom: '10px', marginTop: '-45px' }}
            >
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
              <Typography
                variant="h4"
                style={{ marginLeft: '5px', marginBottom: '10px', marginTop: '-10px' }}
              >
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
                      role="textbox"
                      fullWidth
                      size="small"
                      margin="normal"
                      required
                      inputProps={{
                        'aria-label': t('task_lists.task_list_name'),
                        'data-testid': 'task-list-name',
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
                    style={{ marginLeft: isMobile ? 0 : 8, marginTop: !isMobile && 41 }}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      role="button"
                      disabled={!body.length}
                      color="primary"
                      aria-label={t('task_lists.save')}
                      data-testid="task-list-save-button"
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
      </Grid>
    </div>
  );
}

const useStyles = makeStyles({
  header: {
    marginBottom: '10px'
  }
});
