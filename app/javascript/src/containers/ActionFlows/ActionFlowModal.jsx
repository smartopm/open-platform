/* eslint-disable react/no-array-index-key */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useLazyQuery } from 'react-apollo'
import MaterialConfig from 'react-awesome-query-builder/lib/config/material'
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
  FormControl
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import colors from '../../themes/nkwashi/colors'
import { Events, Actions, ActionFields, RuleFields, LabelsQuery } from '../../graphql/queries'
import QueryBuilder from '../../components/QueryBuilder'
import { titleize, capitalize } from '../../utils/helpers'

const { primary, dew } = colors
const initialData = {
  title: '',
  description: '',
  eventType: '',
  eventCondition: '',
  eventConditionQuery: '',
  actionType: ''
}
export default function ActionFlowModal({ open, closeModal, handleSave, selectedActionFlow }) {
  const [data, setData] = useState(initialData)
  const [metaData, setMetaData] = useState({})

  const [loadLabelsLite, {
    data: labelsLiteData
  }] = useLazyQuery(LabelsQuery, 
    {
      fetchPolicy: 'cache-and-network'
    })

  const eventData = useQuery(Events)
  const actionData = useQuery(Actions)
  const actionFieldsData = useQuery(ActionFields, {
    variables: { action: data.actionType }
  })
  const ruleFieldsData = useQuery(RuleFields, {
    variables: { eventType: data.eventType }
  })

  useEffect(() => {
    if (isEdit()) {
      setData(selectedActionFlow)

      const actionFieldsValues = {}
      Object.entries(selectedActionFlow.eventAction.action_fields).forEach(([key, val]) => {
        actionFieldsValues[key] = (val.value.includes('_') ? titleize(val.value) : val.value)
      })
      setMetaData(actionFieldsValues)
    }
    return () => {
      setData(initialData)
      setMetaData({})
    }
  }, [selectedActionFlow])

  const ruleFieldsConfig = {}

  if (ruleFieldsData.data) {
    ruleFieldsData.data.ruleFields.forEach((field) => {
      ruleFieldsConfig[field] = {
        label: titleize(field),
        type: 'text',
        valueSources: ['value']
      }
    })
  }

  const InitialConfig = MaterialConfig
  const queryBuilderConfig = {
    ...InitialConfig,
    fields: ruleFieldsConfig
  }

  function handleInputChange(event) {
    const { name, value } = event.target
    
    if(data.eventType && value === 'notification') {
      loadLabelsLite()
    }

    setData({
      ...data,
      [name]: value
    })
  }

  function handleSelectLabel(event) {
    const { name, value } = event.target

    setMetaData({
      ...metaData,
      [name]: value
    })

    setData({
      ...data,
      [name]: value
    })
  }

  function handleQueryOnChange(conditionJsonLogic, conditionQuery) {
    if (conditionJsonLogic) {
      setData({
        ...data,
        eventCondition: JSON.stringify(conditionJsonLogic.logic),
        eventConditionQuery: JSON.stringify(conditionQuery)
      })
    }
  }

  function isEdit() {
    return Object.keys(selectedActionFlow).length > 0
  }

  // console.log('eventdata', eventData)
  // console.log('actiondata', actionData)
  // console.log('actionFieldsData', actionFieldsData)
  // console.log('ruleFieldsData', ruleFieldsData)

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle
        id="workflow-dialog-title"
        style={{
        borderBottom: `1px solid ${primary}`,
        background: dew,
        color: primary
      }}
      >
        { isEdit() ? 'Edit Workflow' : 'New Workflow' }
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Title"
          name="title"
          type="text"
          fullWidth
          value={data.title}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          id="description"
          label="Description"
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
            <InputLabel id="select-event">Select Event Type</InputLabel>
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
            addRuleLabel="Add Rule"
          />
        </div>
        <FormControl fullWidth>
          {actionData.data && (
          <>
            <InputLabel id="select-action">Select an action</InputLabel>
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
                <MenuItem key={index} value={action.toLowerCase()}>
                  {`Send ${action}`}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
        </FormControl>
        {data.actionType && actionFieldsData.data &&
        actionFieldsData.data.actionFields.map((actionField, index) => (
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
              })
            }}
            options={ruleFieldsData.data?.ruleFields.map((option) => titleize(option)) || []}
            renderInput={(params) => {
              if(actionField.type === 'select' && actionField.name === 'label') {
                return (
                  <FormControl fullWidth>
                    <InputLabel id={`select-${actionField.name}`}>{`Select ${capitalize(actionField.name)}`}</InputLabel>
                    <Select
                      labelId={`select-${actionField.name}`}
                      id={`${actionField.name}-id-section`}
                      name={actionField.name}
                      value={data[actionField.name] || ''}
                      onChange={handleSelectLabel}
                      fullWidth
                    >
                      {labelsLiteData?.labels.map(({ id, shortDesc}) => (
                        <MenuItem key={id} value={shortDesc}>
                          {`${shortDesc}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )
              }
              return (
                <TextField
                  {...params}
                  label={capitalize(actionField.name)}
                  name={actionField.name}
                  margin="normal"
                  variant="outlined"
                  multiline
                />
            )}}
          />
        ))}
      </DialogContent>
      <DialogActions style={{ justifyContent: 'flex-start' }}>
        <Button onClick={closeModal} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={() => handleSave(data, metaData)} color="primary" variant="contained">
          {isEdit() ? 'Save Changes' : 'Save'}
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
}
