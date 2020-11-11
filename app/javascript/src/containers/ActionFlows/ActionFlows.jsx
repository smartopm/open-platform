/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useQuery, useMutation } from 'react-apollo'
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
import MaterialConfig from 'react-awesome-query-builder/lib/config/material'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Nav from '../../components/Nav'
import { Events, Actions, ActionFields, RuleFields } from '../../graphql/queries'
import colors from '../../themes/nkwashi/colors'
import { titleize, capitalize } from '../../utils/helpers'
import QueryBuilder from '../../components/QueryBuilder'
import { CreateActionFlow } from '../../graphql/mutations'
import MessageAlert from '../../components/MessageAlert'

const { primary, dew } = colors
const initialData = {
  title: '',
  description: '',
  eventType: '',
  eventCondition: '',
  actionType: ''
}
export default function ActionFlows() {
  const [open, setModalOpen] = useState(false)
  const [messageAlertOpen, setMessageAlertOpen] = useState(false)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [data, setData] = useState(initialData)
  const [metaData, setMetaData] = useState({})

  const eventData = useQuery(Events)
  const actionData = useQuery(Actions)
  const actionFieldsData = useQuery(ActionFields, {
    variables: { action: data.actionType }
  })
  const ruleFieldsData = useQuery(RuleFields, {
    variables: { eventType: data.eventType }
  })
  const [createActionFlow] = useMutation(CreateActionFlow)


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

  function openModal() {
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
  }

  function handleQueryOnChange(selectedOptions) {
    if (selectedOptions) {
      setData({
        ...data,
        eventCondition: JSON.stringify(selectedOptions.logic)
      })
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target
    setData({
      ...data,
      [name]: value
    })
  }

  function isMetaDataAVariable(value) {
    return value.indexOf(' ') >= 0
  }

  function metaDataVariableValue(value) {
    return value.replace(/ /g, "_").toLowerCase()
  }

  function handleSave() {
    const actionMetaData = {}
    Object.entries(metaData).forEach(([key, value]) => {
      actionMetaData[key] = {
        name: key,
        value: isMetaDataAVariable(value) ? metaDataVariableValue(value) : value,
        type: isMetaDataAVariable(value) ? 'variable' : 'string'
      }
    })

    const eventAction = {
      action_name: data.actionType,
      action_fields: actionMetaData
    }

    createActionFlow({ variables: {
      title: data.title,
      description: data.description,
      eventType: data.eventType,
      eventCondition: data.eventCondition,
      eventAction
     }
    }).then(() => {
      closeModal()
      setMessageAlertOpen(true)
      setIsSuccessAlert(true)
    }).catch(() => {
      setMessageAlertOpen(true)
      setIsSuccessAlert(false)
    })
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlertOpen(false)
  }

  return (
    <>
      <Nav navName="Workflow" menuButton="back" backTo="/" />
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
          New Workflow
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
                  name="eventType"
                  value={data.eventType}
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
                  name="actionType"
                  value={data.actionType}
                  onChange={handleInputChange}
                  fullWidth
                >
                  {actionData.data.actions.map((action, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <MenuItem key={index} value={action}>
                      {`Send ${action}`}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </FormControl>
          {actionFieldsData.data &&
            actionFieldsData.data.actionFields.map((actionField, index) => (
              <Autocomplete
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                id={`${actionField.name}-action-input`}
                freeSolo
                inputValue={metaData[actionField.name]}
                onInputChange={(_event, newValue) => {
                  setMetaData({
                    ...metaData,
                    [actionField.name]: newValue
                  })
                }}
                options={ruleFieldsData.data?.ruleFields.map((option) => titleize(option))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={capitalize(actionField.name)}
                    name={actionField.name}
                    margin="normal"
                    variant="outlined"
                  />
                )}
              />
            ))}
        </DialogContent>
        <DialogActions style={{ justifyContent: 'flex-start' }}>
          <Button onClick={closeModal} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <MessageAlert
        type={isSuccessAlert ? "success" : "error"}
        message={isSuccessAlert ? "Success: Changes saved successfully" : "Sorry, an error occcurred. Try again."}
        open={messageAlertOpen}
        handleClose={handleMessageAlertClose}
      />
      <Button
        variant="contained"
        onClick={openModal}
        color="primary"
        className={`btn ${css(styles.addFlow)} `}
      >
        New Workflow
      </Button>
    </>
  )
}

const styles = StyleSheet.create({
  addFlow: {
    boxShadow: 'none',
    margin: 5,
    float: 'right',
    color: '#FFFFFF'
  }
})
