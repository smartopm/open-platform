/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useMutation , useQuery } from 'react-apollo'
import { useHistory } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { useLocation } from 'react-router'
import Nav from '../../components/Nav'
import { CreateActionFlow } from '../../graphql/mutations'
import MessageAlert from '../../components/MessageAlert'
import ActionFlowModal from './ActionFlowModal'
import { ActionFlow } from '../../graphql/queries'


export default function ActionFlows() {
  const [open, setModalOpen] = useState(false)
  const [messageAlertOpen, setMessageAlertOpen] = useState(false)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [selectedActionFlow, setSelectedActionFlow] = useState({})
  const location = useLocation()
  const history = useHistory()
  const [createActionFlow] = useMutation(CreateActionFlow)

  const actionFlowData = useQuery(ActionFlow)

  useEffect(() => {
    const locationInfo = location.pathname.split('/')
    if (locationInfo[locationInfo.length - 1] === 'new') {
      openModal()
    }

    if (locationInfo[locationInfo.length - 1] === 'edit') {
      openModal(locationInfo[locationInfo.length - 2])
    }
  }, [actionFlowData.data])

  function openModal(flowId = null) {
    let path = '/action_flows/new'
    if (flowId) {
      path = `/action_flows/${flowId}/edit`
    }

    setSelectedActionFlow(getActionFlow(flowId))
    history.push(path)
    setModalOpen(true)
  }

  function closeModal() {
    setSelectedActionFlow({})
    history.push('/action_flows')
    setModalOpen(false)
  }

  function isMetaDataAVariable(value) {
    return value.indexOf(' ') >= 0
  }

  function metaDataVariableValue(value) {
    return value.replace(/ /g, '_').toLowerCase()
  }

  function handleSave(data, metaData) {
    const actionMetaData = {}
    Object.entries(metaData).forEach(([key, value]) => {
      actionMetaData[key] = {
        name: key,
        value: isMetaDataAVariable(value)
          ? metaDataVariableValue(value)
          : value,
        type: isMetaDataAVariable(value) ? 'variable' : 'string'
      }
    })

    const eventAction = {
      action_name: data.actionType,
      action_fields: actionMetaData
    }

    createActionFlow({
      variables: {
        title: data.title,
        description: data.description,
        eventType: data.eventType,
        eventCondition: data.eventCondition,
        eventConditionQuery: data.eventConditionQuery,
        eventAction
      }
    })
      .then(() => {
        closeModal()
        setMessageAlertOpen(true)
        setIsSuccessAlert(true)
      })
      .catch(() => {
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

  function getActionFlow(id) {
    if (!id) return {}
    return (
      actionFlowData.data?.actionFlow.find(flow => {
        return flow.id === id
      }) || {}
    )
  }

  return (
    <>
      <Nav navName="Workflow" menuButton="back" backTo="/" />
      <ActionFlowModal
        open={open}
        closeModal={closeModal}
        handleSave={handleSave}
        selectedActionFlow={selectedActionFlow}
      />
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={
          isSuccessAlert
            ? 'Success: Changes saved successfully'
            : 'Sorry, an error occcurred. Try again.'
        }
        open={messageAlertOpen}
        handleClose={handleMessageAlertClose}
      />
      <Button
        variant="contained"
        onClick={() => openModal()}
        color="primary"
        className={`btn ${css(styles.addFlow)} `}
      >
        New Workflow
      </Button>
      {actionFlowData.data?.actionFlow.map(flow => (
        <Button
          key={flow.id}
          onClick={() => openModal(flow.id)}
        >
          {`Edit - ${flow.id}`}
        </Button>
      ))}
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
