/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useQuery } from 'react-apollo'
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
import Nav from '../../components/Nav'
import { Events, Actions, ActionFields } from '../../graphql/queries'
import colors from '../../themes/nkwashi/colors'
import { titleize, capitalize } from '../../utils/helpers'
import QueryBuilder from '../../components/QueryBuilder'

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
  const [data, setData] = useState(initialData)
  const [metaData, setMetaData] = useState({})

  const eventData = useQuery(Events)
  const actionData = useQuery(Actions)
  const actionFieldsData = useQuery(ActionFields, {
    variables: { action: data.actionType }
  })

  const InitialConfig = MaterialConfig
  const queryBuilderConfig = {
    ...InitialConfig,
    fields: {
      user: {
        label: 'User',
        type: 'text',
        valueSources: ['value']
      },
      Author: {
        label: 'Author',
        type: 'text',
        valueSources: ['value']
      }
    }
  }

  function openModal() {
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
  }

  function handleQueryOnChange(selectedOptions) {
    if (selectedOptions) {
      console.log(selectedOptions.logic)
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target
    setData({
      ...data,
      [name]: value
    })
  }

  function handleMetaDataChange(event) {
    const { name, value } = event.target
    setMetaData({
      ...metaData,
      [name]: value
    })
  }

  console.log('metaData', metaData)
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
          <div style={{ marginTop: '20px' }}>
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
              <TextField
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                autoFocus
                margin="dense"
                id={actionField.name}
                label={capitalize(actionField.name)}
                name={actionField.name}
                type="text"
                fullWidth
                value={metaData[actionField.name]}
                onChange={handleMetaDataChange}
              />
            ))}
        </DialogContent>
        <DialogActions style={{ justifyContent: 'flex-start' }}>
          <Button onClick={closeModal} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={() => {}} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
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
