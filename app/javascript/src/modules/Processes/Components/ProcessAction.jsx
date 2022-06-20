import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-apollo';
import { ProcessFormsQuery, ProcessTaskListsQuery } from '../graphql/process_list_queries';
import CenteredContent from '../../../shared/CenteredContent';
import { ProcessCreateMutation, ProcessUpdateMutation } from '../graphql/process_list_mutation';
import { formatError } from '../../../utils/helpers';
import MessageAlert from '../../../components/MessageAlert';
import PageWrapper from '../../../shared/PageWrapper';

export default function ProcessAction() {
  const matches = useMediaQuery('(max-width:900px)');
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation(['process', 'common']);
  const [alertOpen, setAlertOpen] = useState(false);
  const [action, setAction] = useState('create');
  const processInitialData = { processName: '', formId: '', noteListId: '' };
  const [processData, setProcessData] = useState(processInitialData);
  const [info, setInfo] = useState({ loading: false, error: false, message: '' });

  useEffect(() => {
    if (location.pathname === '/processes/templates/edit') {
      const { process } = location.state;
      if (!process) return;
      setAction('edit');
      setProcessData({
        id: process.id,
        processName: process.name,
        formId: process.form?.id,
        noteListId: process.noteList?.id
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const { data: formData } = useQuery(ProcessFormsQuery, {
    fetchPolicy: 'cache-and-network'
  });

  const { data: taskListData } = useQuery(ProcessTaskListsQuery, {
    fetchPolicy: 'cache-and-network'
  });

  const [processCreate] = useMutation(ProcessCreateMutation);
  const [processUpdate] = useMutation(ProcessUpdateMutation);

  function handleInputChange(e) {
    const property = e.target.name;
    e.stopPropagation();
    setProcessData({
      ...processData,
      [property]: e.target.value
    });
  }

  function handleClose() {
    setInfo({
      ...info,
      error: false,
      message: ''
    });

    setAlertOpen(false);
  }

  function handleProcessCreate({ processName, formId, noteListId }) {
    processCreate({
      variables: {
        name: processName,
        formId,
        noteListId
      }
    })
      .then(() => {
        setInfo({
          ...info,
          loading: false
        });
        history.push('/processes/templates');
      })
      .catch(err => {
        setInfo({
          ...info,
          error: true,
          message: formatError(err.message)
        });
        setAlertOpen(true);
      });
  }

  function handleProcessUpdate({ id, processName, formId, noteListId }) {
    processUpdate({
      variables: {
        id,
        formId,
        noteListId,
        name: processName
      }
    })
      .then(() => {
        setInfo({
          ...info,
          message: t('templates.process_updated'),
          loading: false
        });
        setAlertOpen(true);
        history.push('/processes/templates');
      })
      .catch(err => {
        setInfo({
          ...info,
          error: true,
          message: formatError(err.message)
        });
        setAlertOpen(true);
      });
  }

  const breadCrumbObj = {
    linkText: t('breadcrumbs.processes'),
    linkHref: '/processes',
    pageName: action === 'edit' ? t('breadcrumbs.edit_process') : t('breadcrumbs.create_process')
  }

  function handleSubmit(e) {
    e.stopPropagation();
    setInfo({
      ...info,
      loading: true
    });

    const { processName, formId, noteListId } = processData;
    if (!processName || !formId || !noteListId) {
      return;
    }

    if (action === 'edit') {
      const { id } = processData;
      if (!id) return;
      handleProcessUpdate(processData);
    } else {
      handleProcessCreate({ processName, formId, noteListId });
    }
  }

  return (
    <PageWrapper
      pageTitle={action === 'edit' ? t('templates.edit_process') : t('templates.create_process')}
      breadCrumbObj={breadCrumbObj}
      showBreadCrumb
    >
      <MessageAlert
        type={info.error ? 'error' : 'success'}
        message={info.message}
        open={alertOpen}
        handleClose={handleClose}
      />
      <Container>
        <Grid
          container
          spacing={3}
          style={matches ? { padding: '10px 10px' } : { padding: '20px 150px' }}
        >
          <Grid item md={12} xs={12}>
            <TextField
              fullWidth
              required
              name="processName"
              id="process-name"
              label={
                action === 'edit'
                  ? t('templates.edit_process_name_label')
                  : t('templates.new_process_name_label')
              }
              helperText={t('templates.process_name_helper_text')}
              variant="outlined"
              className="process-txt-input"
              onChange={handleInputChange}
              value={processData.processName}
              data-testid="process-name"
              inputProps={{ 'data-testid': 'process-name-input' }}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <FormControl fullWidth>
              <InputLabel id="processFormLabel">{t('templates.process_form_label')}</InputLabel>
              {formData?.forms?.length && (
                <Select
                  name="formId"
                  id="formId"
                  label={t('templates.process_form_label')}
                  value={processData.formId}
                  onChange={handleInputChange}
                  data-testid="process-form-dropdown"
                  required
                >
                  {formData?.forms.map(form => (
                    <MenuItem key={form.id} value={form.id}>
                      {form.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
              <FormHelperText data-testid="process-form-helper-text">
                {t('templates.process_form_helper_text')}
                <Link to="/forms">{t('templates.process_form_helper_text_link_text')}</Link>
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12}>
            <FormControl fullWidth>
              <InputLabel id="noteListId">{t('templates.process_task_list_label')}</InputLabel>
              {taskListData?.processTaskLists?.length && (
                <Select
                  name="noteListId"
                  id="noteListId"
                  label={t('templates.process_task_list_label')}
                  defaultValue=""
                  value={processData.noteListId}
                  onChange={handleInputChange}
                  data-testid="process-note-list-dropdown"
                  required
                >
                  {taskListData?.processTaskLists?.map(taskList => (
                    <MenuItem key={taskList.id} value={taskList.id}>
                      {taskList.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
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
                disabled={!processData.formId || !processData.noteListId || info.loading}
                aria-label="process-submit"
                data-testid="process-submit-btn"
                onClick={handleSubmit}
              >
                {info.loading
                  ? t('templates.saving_process')
                  : action === 'edit'
                  ? t('templates.edit_process')
                  : t('templates.save_process')}
              </Button>
            </CenteredContent>
          </Grid>
        </Grid>
      </Container>
    </PageWrapper>
  );
}
