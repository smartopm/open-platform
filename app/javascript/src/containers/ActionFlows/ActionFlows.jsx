/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useMutation } from 'react-apollo'
import { useHistory } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { useLocation } from 'react-router'
import Nav from '../../components/Nav'
import { CreateActionFlow } from '../../graphql/mutations'
import MessageAlert from '../../components/MessageAlert'
import ActionFlowModal from './ActionFlowModal'

export default function ActionFlows() {
  const [open, setModalOpen] = useState(false)
  const [messageAlertOpen, setMessageAlertOpen] = useState(false)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const location = useLocation()
  const history = useHistory()
  const [createActionFlow] = useMutation(CreateActionFlow)

  useEffect(() => {
    if (location.pathname === '/action_flows/new') {
      setModalOpen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openModal() {
    setModalOpen(true)
    history.push('/action_flows/new')
  }

  function closeModal() {
    setModalOpen(false)
    history.push('/action_flows')
  }

  function isMetaDataAVariable(value) {
    return value.indexOf(' ') >= 0
  }

  function metaDataVariableValue(value) {
    return value.replace(/ /g, "_").toLowerCase()
  }

  function handleSave(data, metaData) {
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
      <ActionFlowModal open={open} closeModal={closeModal} handleSave={handleSave} />
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
