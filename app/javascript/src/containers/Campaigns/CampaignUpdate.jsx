import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import {  useQuery } from 'react-apollo'
import { Campaign } from '../../graphql/queries'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import Loading from '../../components/Loading'
import Nav from '../../components/Nav'
import ErrorPage from '../../components/Error'
import CampaignForm from '../../components/CampaignForm'

export default function CampaignUpdate({ match }) {
  const authState = useContext(AuthStateContext)
  const { data, error, loading, refetch } = useQuery(Campaign, {
    variables: { id: match.params.id },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })

  if (authState.user.userType !== 'admin') {
    return <Redirect push to="/" />
  }
  if (loading) return <Loading />
  if (error) return <ErrorPage />

<<<<<<< HEAD
  if (!formData.loaded && data) {
    setFormData({ ...data.campaign, loaded: true })
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  function handleSubmit(e) {
    e.preventDefault()

    setTimeout(() => {
      window.location.reload(false)
    }, 3000)
   
 
    const campaignData = {
      id: formData.id,
      name: formData.name,
      message: formData.message,
      batchTime,
      userIdList: formData.userIdList,
      labels: label.toString()
    }

    campaign({ variables: campaignData })
      .then(() => {
        setIsSubmitted(true)
      })
      .catch(err => {
        setErrorMsg(err.message)
      })
  }

  function handleLabelSelect(lastLabel) {
    const { id } = lastLabel
    setLabel([...label, id])
  }

  function handleUserIDList(_event, value) {
    let userIds = DelimiterFormatter(value)
    setFormData({
      ...formData,
      userIdList: userIds.toString()
    })
  }
  console.log("new date"+batchTime);
  console.log("db data"+formData.batchTime);
=======
>>>>>>> e22c9daca0e17da58a3c422d4a34e059e35d73af
  return (
    <>
      <Nav navName="Campaign Update" menuButton="back" backTo="/campaigns" />
      <CampaignForm authState={authState} data={data?.campaign} refetch={refetch} />
    </>
  )
}

export function getJustLabels(labels) {
  if(!labels.length) return
  let str = []
  for (let index = 0; index < labels.length; index++) {
    const element = labels[index]
    if (typeof element === 'object') {
      str.push(element.shortDesc)
    }
    str.push(element)
  }
  return str.filter(el => typeof el === 'string')
}
