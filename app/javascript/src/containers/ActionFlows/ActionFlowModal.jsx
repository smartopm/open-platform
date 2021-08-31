/* eslint-disable security/detect-object-injection */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-use-before-define */
/* eslint-disable no-return-assign */
/* eslint-disable no-sequences */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useLazyQuery } from 'react-apollo';
import MaterialConfig from 'react-awesome-query-builder/lib/config/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useTheme } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-input-2'
import DatePickerDialog from '../../components/DatePickerDialog';
import { UserChip } from '../../modules/Tasks/Components/UserChip';
import {
  Events,
  Actions,
  ActionFields,
  RuleFields,
  LabelsQuery,
  UsersLiteQuery
} from '../../graphql/queries';
// from a different module
import { EmailTemplatesQuery } from '../../modules/Emails/graphql/email_queries';
import QueryBuilder from '../../components/QueryBuilder';
import { titleize, capitalize, sentencizeAction } from '../../utils/helpers';
import { dateWidget, NotesCategories, defaultBusinessReasons } from '../../utils/constants';
import UserAutoResult from '../../shared/UserAutoResult';

// const { primary, dew } = colors;
const initialData = {
  title: '',
  description: '',
  eventType: '',
  eventCondition: '',
  eventConditionQuery: '',
  actionType: ''
};
export default function ActionFlowModal({ open, closeModal, handleSave, selectedActionFlow }) {
  const [data, setData] = useState(initialData);
  const [metaData, setMetaData] = useState({});
  const [selectedDate, setDate] = useState(new Date());
  const [assignees, setAssignees] = useState([]);
  const theme = useTheme();
  const { t } = useTranslation(['actionflow', 'common'])

  const [loadLabelsLite, { data: labelsLiteData }] = useLazyQuery(LabelsQuery, {
    fetchPolicy: 'cache-and-network'
  });
  const [loadAssignees, { data: assigneesLiteData }] = useLazyQuery(UsersLiteQuery, {
    variables: { query: 'user_type = admin' },
    errorPolicy: 'all'
  });
  const [loadEmailTemplates, { data: emailTemplatesData }] = useLazyQuery(EmailTemplatesQuery, {
    fetchPolicy: 'cache-and-network'
  });

  const eventData = useQuery(Events);
  const actionData = useQuery(Actions);

  const actionFieldsData = useQuery(ActionFields, {
    variables: { action: data.actionType }
  });
  const ruleFieldsData = useQuery(RuleFields, {
    variables: { eventType: data.eventType }
  });

  useEffect(() => {
    if (isEdit()) {
      setData(selectedActionFlow);

      const actionFieldsValues = {};
      Object.entries(selectedActionFlow.eventAction.action_fields).forEach(([key, val]) => {
        actionFieldsValues[key] = val.value.includes('_') ? titleize(val.value) : val.value;
      });
      setMetaData(actionFieldsValues);
      loadLabelsLite();
      loadAssignees();
      loadEmailTemplates();
    }
    return () => {
      setData(initialData);
      setMetaData({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedActionFlow]);

  const ruleFieldsConfig = {};

  if (ruleFieldsData.data) {
    ruleFieldsData.data.ruleFields.forEach(field => {
      if (['invoice_previous_status', 'invoice_current_status'].includes(field)) {
        addQuerySelectMenu(field, {
          in_progress: 'In Progress',
          paid: 'Paid',
          late: 'Late',
          cancelled: 'Cancelled',
          '': 'Null'
        });
      } else if (field === 'deposit_status') {
        addQuerySelectMenu(field, {
          settled: 'Settled',
          pending: 'Pending',
          denied: 'Denied',
          cancelled: 'Cancelled',
          '': 'Null'
        });
      } else if (field === 'task_assign_user_type') {
        addQuerySelectMenu(field, {
          admin: 'Admin',
          security_guard: 'Security Guard',
          resident: 'Resident',
          contractor: 'Contractor',
          prospective_client: 'Prospective Client',
          client: 'Client',
          visitor: 'Visitor',
          custodian: 'Store Custodian'
        });
      } else if (['visit_request_start_time', 'visit_request_end_time'].includes(field)) {
        addQueryDateInput(field);
      } else if (field === 'visit_request_reason') {
        addQuerySelectMenu(field, defaultBusinessReasons);
      } else {
        ruleFieldsConfig[field] = {
          label: titleize(field),
          type: 'text',
          valueSources: ['value']
        };
      }
    });
  }

  const InitialConfig = MaterialConfig;
  const queryBuilderConfig = {
    ...InitialConfig,
    fields: ruleFieldsConfig,
    widgets: dateWidget
  };

  function addQuerySelectMenu(field, options) {
    ruleFieldsConfig[field] = {
      label: titleize(field),
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        listValues: Object.entries(options).map(([key, val]) => {
          return { value: key, title: val };
        })
      }
    };
  }

  function addQueryDateInput(field) {
    ruleFieldsConfig[field] = {
      label: titleize(field),
      type: 'datetime',
      valueSources: ['value']
    };
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    if (data.eventType && value === 'notification') {
      loadLabelsLite();
    }

    if (data.eventType && value === 'task') {
      loadAssignees();
    }

    if (data.eventType && value === 'custom_email') {
      loadEmailTemplates();
    }

    // Reset the array of assignees when a new eventType/action is selected
    if (assignees.length) setAssignees([]);

    setData({
      ...data,
      [name]: value
    });
  }

  function handleSelect(event) {
    const { name, value } = event.target;

    setMetaData({
      ...metaData,
      [name]: value
    });

    setData({
      ...data,
      [name]: value
    });
  }

  function handlePhoneNumberInput(event) {
    const { name, value } = event
    setMetaData({
      ...metaData,
      [name]: value
    });

    setData({
      ...data,
      [name]: value
    });
  }

  function handleDateChange(params) {
    const { name, value } = params;

    setDate(value);

    setMetaData({
      ...metaData,
      [name]: value.toISOString()
    });

    setData({
      ...data,
      [name]: value.toISOString()
    });
  }

  function getAssigneeIds(user) {
    return user.map(u => u.id).join(',');
  }

  function handleChooseAssignees(event) {
    const { name, value: user } = event.target;

    setAssignees([...user]);

    const assigneeIds = getAssigneeIds(user);

    setMetaData({
      ...metaData,
      [name]: assigneeIds
    });

    setData({
      ...data,
      [name]: assigneeIds
    });
  }

  function handleQueryOnChange(conditionJsonLogic, conditionQuery) {
    if (conditionJsonLogic) {
      setData({
        ...data,
        eventCondition: JSON.stringify(conditionJsonLogic.logic),
        eventConditionQuery: JSON.stringify(conditionQuery)
      });
    }
  }

  function isEdit() {
    return Object.keys(selectedActionFlow).length > 0;
  }

  return (
    <Dialog open={open} onClose={closeModal} aria-labelledby="form-dialog-title">
      <DialogTitle
        id="workflow-dialog-title"
        style={{
          borderBottom: `1px solid ${theme.palette.primary.main}`,
          color: theme.palette.primary.main
        }}
      >
        {isEdit() ? t('actionflow:form_actions.edit_workflow') : t('actionflow:form_actions.new_workflow')}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label={t('common:form_fields.title')}
          name="title"
          type="text"
          fullWidth
          value={data.title}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          id="description"
          label={t('common:form_fields.description')}
          name="description"
          type="text"
          fullWidth
          multiline
          value={data.description}
          onChange={handleInputChange}
        />
        <FormControl fullWidth>
          {eventData.data && (
            <>
              <InputLabel id="select-event">{t('actionflow:form_fields.select_event')}</InputLabel>
              <Select
                labelId="select-event"
                id="select-event"
                data-testid="select-event-type"
                name="eventType"
                value={data.eventType || ''}
                fullWidth
                onChange={handleInputChange}
              >
                {eventData.data.events.map((event, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <MenuItem key={index} value={event}>
                    {`On ${titleize(event)}`}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
        </FormControl>
        <div style={{ marginTop: '20px', marginBottom: '5px' }}>
          <QueryBuilder
            handleOnChange={handleQueryOnChange}
            builderConfig={queryBuilderConfig}
            initialQueryValue={JSON.parse(selectedActionFlow.eventConditionQuery || '{}')}
            addRuleLabel={t('actionflow:form_fields.add_rule')}
          />
        </div>
        <FormControl fullWidth>
          {data.eventType && actionData.data && (
            <>
              <InputLabel id="select-action">{t('actionflow:form_fields.select_action')}</InputLabel>
              <Select
                labelId="select-action"
                id="select-action"
                data-testid="select-action-type"
                name="actionType"
                value={data.actionType?.toLowerCase() || ''}
                onChange={handleInputChange}
                fullWidth
              >
                {actionData.data.actions.map((action, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <MenuItem key={index} value={action.toLowerCase().replace(/ /g, '_')}>
                    {sentencizeAction(action)}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
        </FormControl>
        {data.actionType &&
          actionFieldsData.data &&
          actionFieldsData.data.actionFields.map((actionField, index) => {
            // REFACTOR THESE IF-ELSEs (Nurudeen)
            if (actionField.type === 'select' && actionField.name === 'label') {
              return (
                <FormControl fullWidth>
                  <InputLabel id={`select-${actionField.name}`}>
                    {t('actionflow:form_actions.select', {name: capitalize(actionField.name)})}
                  </InputLabel>
                  <Select
                    labelId={`select-${actionField.name}`}
                    id={`${actionField.name}-id-section`}
                    name={actionField.name}
                    value={data[actionField.name] || ''}
                    onChange={handleSelect}
                    fullWidth
                  >
                    {labelsLiteData?.labels.map(({ id, shortDesc }) => (
                      <MenuItem key={id} value={shortDesc}>
                        {`${shortDesc}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }
            if (actionField.type === 'select' && actionField.name === 'category') {
              return (
                <FormControl fullWidth>
                  <InputLabel id={`select-${actionField.name}`}>
                    {t('actionflow:form_actions.select', {name: capitalize(actionField.name)})}
                  </InputLabel>
                  <Select
                    labelId={`select-${actionField.name}`}
                    id={`${actionField.name}-id-section`}
                    name={actionField.name}
                    value={data[actionField.name] || ''}
                    onChange={handleSelect}
                    fullWidth
                  >
                    {Object.entries(NotesCategories).map(([key, val]) => (
                      <MenuItem key={key} value={key}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }
            if (actionField.type === 'select' && actionField.name === 'assignees') {
              return (
                <FormControl fullWidth>
                  <FormHelperText>{t('actionflow:form_fields.assign_user')}</FormHelperText>
                  <Select
                    labelId={`select-${actionField.name}`}
                    id={`${actionField.name}-id-section`}
                    name={actionField.name}
                    value={assignees}
                    onChange={handleChooseAssignees}
                    fullWidth
                    multiple
                    MenuProps={{ MenuListProps: { disablePadding: true } }}
                    renderValue={selected => (
                      <div>
                        {selected.map((value, i) => (
                          <UserChip user={value} key={i} label={value.name} size="medium" />
                        ))}
                      </div>
                    )}
                  >
                    {assigneesLiteData?.usersLite.map(user => (
                      <MenuItem key={user.id} value={user} style={{ padding: 0 }}>
                        <UserAutoResult user={user} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }
            if (actionField.type === 'select' && actionField.name === 'template') {
              return (
                <FormControl fullWidth>
                  <InputLabel id={`select-${actionField.name}`}>
                    {t('actionflow:form_actions.select', {name: capitalize(actionField.name)})}
                  </InputLabel>
                  <Select
                    labelId={`select-${actionField.name}`}
                    id={`${actionField.name}-id-section`}
                    name={actionField.name}
                    value={data[actionField.name] || ''}
                    onChange={handleSelect}
                    fullWidth
                  >
                    {emailTemplatesData?.emailTemplates.map(({ id, name }) => (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }
            if (actionField.type === 'date' && actionField.name === 'due_date') {
              return (
                <FormControl fullWidth>
                  <FormHelperText>{t('actionflow:form_fields.pick_date')}</FormHelperText>
                  <DatePickerDialog
                    handleDateChange={date =>
                      handleDateChange({ name: actionField.name, value: date })}
                    selectedDate={selectedDate}
                  />
                </FormControl>
              );
            }
            if (actionField.type === 'text' && actionField.name === 'phone_number') {
              return (
                <PhoneInput
                  value={data.phoneNumber || ''}
                  inputStyle={{ width: "100%" }}
                  enableSearch
                  inputProps={{
                    name: 'phoneNumber',
                    required: true,
                    'data-testId': 'primary_phone'
                  }}
                  placeholder={t('common:form_placeholders.phone_number')}
                  onChange={value => handlePhoneNumberInput({name: actionField.name, value})}
                  preferredCountries={['hn', 'zm', 'ng', 'in', 'us']}
                />
              );
            }
            return (
              <Autocomplete
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                id={`${actionField.name}-action-input`}
                freeSolo
                value={metaData[actionField.name]}
                inputValue={metaData[actionField.name]}
                onInputChange={(_event, newValue) => {
                  setMetaData({
                    ...metaData,
                    [actionField.name]: newValue
                  });
                }}
                options={ruleFieldsData.data?.ruleFields.map(option => titleize(option)) || []}
                renderInput={params => {
                  return (
                    <TextField
                      {...params}
                      label={capitalize(actionField.name)}
                      name={actionField.name}
                      margin="normal"
                      variant="outlined"
                      multiline
                    />
                  );
                }}
              />
            );
          })}
        {data.actionType === 'custom_email' &&
          emailTemplatesData?.emailTemplates
            .find(temp => temp.id === metaData.template)
            ?.variableNames.map((varName, index) => (
              <Autocomplete
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                id={`${varName}-action-input`}
                freeSolo
                value={metaData[varName]}
                inputValue={metaData[varName]}
                onInputChange={(_event, newValue) => {
                  setMetaData({
                    ...metaData,
                    [varName]: newValue
                  });
                }}
                options={ruleFieldsData.data?.ruleFields.map(option => titleize(option)) || []}
                renderInput={params => {
                  return (
                    <TextField
                      {...params}
                      label={capitalize(varName)}
                      name={varName}
                      margin="normal"
                      variant="outlined"
                      multiline
                    />
                  );
                }}
              />
            ))}
      </DialogContent>
      <DialogActions style={{ justifyContent: 'flex-start' }}>
        <Button onClick={closeModal} color="secondary" variant="outlined">
          {t('common:form_actions.cancel')}
        </Button>
        <Button onClick={() => handleSave(data, metaData)} color="primary" variant="contained">
          {isEdit() ? t('common:form_actions.save_changes') : t('common:form_actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ActionFlowModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  selectedActionFlow: PropTypes.object.isRequired
};
