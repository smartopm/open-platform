import {
  Breadcrumbs,
  Button, 
  FormControl,
  FormHelperText,
  Grid, 
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-apollo';
import makeStyles from '@mui/styles/makeStyles';
import { ProcessFormsQuery, ProcessTaskListsQuery } from '../graphql/process_list_queries';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../shared/CenteredContent';
import { ProcessCreateMutation } from '../graphql/process_list_mutation';
import { formatError } from '../../../utils/helpers';
import MessageAlert from '../../../components/MessageAlert';

export default function ProcessCreate() {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:900px)');
  const history = useHistory();
  const { t } = useTranslation(['process', 'common']);
  const [alertOpen, setAlertOpen] = useState(false);
  const [processData, setProcessData] = useState({ processName: '', formId: '', noteListId: '' })
  const [info, setInfo] = useState({ loading: false, error: false, message: '' })

  const { data: formData, loading: formLoading } = useQuery(ProcessFormsQuery, {
    fetchPolicy: 'cache-and-network'
  });

  const { data: taskListData, loading: taskListLoading } = useQuery(ProcessTaskListsQuery, {
    fetchPolicy: 'cache-and-network'
});

const [processCreate] = useMutation(ProcessCreateMutation)

  function handleInputChange(e){
    const property = e.target.name
    e.stopPropagation();
    setProcessData({
      ...processData,
      [property]: e.target.value,
    });
  }

  function handleClose() {
    setInfo({
      ...info,
      error: false,
      message: '',
    });

    setAlertOpen(false);
  }

  function handleCreateProcess(e){
    e.stopPropagation();
    setInfo({ 
      ...info,
      loading: true,
    });

    const { processName, formId, noteListId } = processData;
    if (!processName || !formId || !noteListId){
      return;
    }

    processCreate({
      variables: {
        name: processName,
        formId,
        noteListId,
      }
    })
      .then(() => {
        setInfo({ 
          ...info,
          loading: false,
        });

      history.push('/processes/templates')
    })
    .catch(err =>{
      setInfo({ 
        ...info,
        error: true,
        message: formatError(err.message),
      });
      setAlertOpen(true)
    })
  }

  if (formLoading || taskListLoading) return <Spinner />;

  return(
    <>
      <MessageAlert
        type={info.error ? 'error' : 'success'}
        message={info.message}
        open={alertOpen}
        handleClose={handleClose}
      />
      <div className="container">
        <Grid container spacing={1}>
          <Grid item md={12} xs={12} style={{ paddingLeft: '10px' }}>
            <div role="presentation">
              <Breadcrumbs aria-label="breadcrumb" style={{ paddingBottom: '10px' }}>
                <Link to="/processes">
                  <Typography color="primary" style={{ marginLeft: '5px' }}>
                    {t('breadcrumbs.processes')}
                  </Typography>
                </Link>
                <Typography color="text.primary">{t('breadcrumbs.create_process')}</Typography>
              </Breadcrumbs>
            </div>
          </Grid>
          <Grid container>
            <Grid item md={11} xs={10} className={classes.header}>
              <Grid container>
                <Grid item md={9} xs={10}>
                  <Typography variant="h4" style={{ marginLeft: '5px', marginBottom: '24px' }}>
                    {t('templates.create_process')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={matches ? { padding: '10px 10px' } : { padding: '20px 150px' }}>
          <Grid item md={12} xs={12}>
            <TextField
              name="processName"
              id="process-name"
              label={t('templates.process_name_label')}
              helperText={t('templates.process_name_helper_text')}
              variant="outlined"
              className='process-txt-input'
              onChange={handleInputChange}
              value={processData.name}
              inputProps={{
              'data-testid': 'new-process-name'
            }}
              fullWidth
              required
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <FormControl fullWidth>
              <InputLabel id="noteListId">{t('templates.process_form_label')}</InputLabel>
              <Select
                name="formId"
                id="formId"
                label={t('templates.process_form_label')}
                value={processData.formId}
                onChange={handleInputChange}
                data-testid="process-form-dropdown"
                required
              >
                {formData?.forms.map((form) => (
                  <MenuItem key={form.id} value={form.id}>
                    {form.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText data-testid="process-form-helper-text">
                {t('templates.process_form_helper_text')}
                <Link to="/forms">
                  {t('templates.process_form_helper_text_link_text')}
                </Link>
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12}>
            <FormControl fullWidth>
              <InputLabel id="noteListId">{t('templates.process_task_list_label')}</InputLabel>
              <Select
                name="noteListId"
                id="noteListId"
                label={t('templates.process_task_list_label')}
                value={processData.noteListId}
                onChange={handleInputChange}
                data-testid="process-note-list-dropdown"
                required
              >
                {taskListData?.processTaskLists?.map((taskList) => (
                  <MenuItem key={taskList.id} value={taskList.id}>
                    {taskList.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText data-testid="process-note-list-helper-text">
                {t('templates.process_task_list_helper_text')}
                <Link to="/tasks/task_lists">
                  {t('templates.process_task_list_helper_text_link_text')}
                </Link>
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12}>
            <CenteredContent>
              <Button
                variant="contained"
                color="primary"
                disabled={(!processData.formId || !processData.noteListId) || info.loading}
                aria-label="process-submit"
                data-testid="process-submit-btn"
                onClick={handleCreateProcess}
              >
                {info.loading ? t('templates.saving_process') : t('templates.save_process')}
              </Button>
            </CenteredContent>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

const useStyles = makeStyles({
  header: {
    marginBottom: '10px'
  }
});