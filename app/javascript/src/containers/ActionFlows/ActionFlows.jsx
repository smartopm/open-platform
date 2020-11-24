/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useMutation, useQuery } from 'react-apollo'
import { useHistory } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { useLocation } from 'react-router'
import Nav from '../../components/Nav'
import { CreateActionFlow, UpdateActionFlow } from '../../graphql/mutations'
import MessageAlert from '../../components/MessageAlert'
import ActionFlowModal from './ActionFlowModal'
import { Flows } from '../../graphql/queries'
import ActionFlowsList from '../../components/ActionFlowsList'
import Loading from '../../components/Loading'
import ErrorPage from '../../components/Error'
import CenteredContent from '../../components/CenteredContent'
import Paginate from '../../components/Paginate'
import { formatError } from '../../utils/helpers'

export default function ActionFlows() {
  const limit = 10
  const [open, setModalOpen] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [selectedActionFlow, setSelectedActionFlow] = useState({})
  const [offset, setOffset] = useState(0)
  const location = useLocation()
  const history = useHistory()
  const [createActionFlow] = useMutation(CreateActionFlow)
  const [updateActionFlow] = useMutation(UpdateActionFlow)

  const { data, error, loading, refetch } = useQuery(Flows, {
    variables: { limit, offset }
  })

  useEffect(() => {
    const locationInfo = location.pathname.split('/')
    if (locationInfo[locationInfo.length - 1] === 'new') {
      openModal()
    }

    if (locationInfo[locationInfo.length - 1] === 'edit') {
      openModal(locationInfo[locationInfo.length - 2])
    }
  }, [data])

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

  // eslint-disable-next-line no-shadow
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

    let variables = {
      title: data.title,
      description: data.description,
      eventType: data.eventType,
      eventCondition: data.eventCondition,
      eventConditionQuery: data.eventConditionQuery,
      eventAction
    }

    let action = createActionFlow

    if (Object.keys(selectedActionFlow).length) {
      variables = {
        ...variables,
        id: selectedActionFlow.id
      }

      action = updateActionFlow
    }

    action({
      variables
    })
      .then(() => {
        closeModal()
        refetch()
        setMessageAlert('Success: Changes saved successfully')
        setIsSuccessAlert(true)
      })
      .catch(e => {
        setMessageAlert(formatError(e.message))
        setIsSuccessAlert(false)
      })
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return
    }
    setMessageAlert('')
  }

  function getActionFlow(id) {
    if (!id) return {}

    return (
      data?.actionFlows.find(flow => {
        return flow.id === id
      }) || {}
    )
  }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) return
      setOffset(offset - limit)
    } else if (action === 'next') {
      setOffset(offset + limit)
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorPage title={error.message} />

  return (
    <>
      <Nav navName="Workflow" menuButton="back" backTo="/" />
      <div className="container">
        <ActionFlowModal
          open={open}
          closeModal={closeModal}
          handleSave={handleSave}
          selectedActionFlow={selectedActionFlow}
        />
        <MessageAlert
          type={isSuccessAlert ? 'success' : 'error'}
          message={messageAlert}
          open={!!messageAlert}
          handleClose={handleMessageAlertClose}
        />
        <div style={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            onClick={() => openModal()}
            color="primary"
            className={`btn ${css(styles.addFlow)} `}
            data-testid="new-flow-btn"
          >
            New Workflow
          </Button>
        </div>
        {data.actionFlows.length ? (
          <>
            <ActionFlowsList openFlowModal={openModal} data={data} refetch={refetch} />
            <CenteredContent>
              <Paginate
                offSet={offset}
                limit={limit}
                active={offset >= 1}
                handlePageChange={paginate}
              />
            </CenteredContent>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>No Workflow found</div>
        )}
      </div>
    </>
  )
}

const styles = StyleSheet.create({
  addFlow: {
    boxShadow: 'none',
    marginRight: 7,
    marginBottom: 20,
    color: '#FFFFFF'
  }
})
