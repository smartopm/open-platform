import React from 'react'
import { useQuery } from 'react-apollo'
import { LabelsQuery } from '../../graphql/queries'
import ErrorPage from '../Error'
import Loading from '../Loading'
import LabelItem from './LabelItem'

export default function LabelList() {
  const label = { shortDesc: 'blue', id: '35y434rws', userCount: 20,}
  const { data, error, loading } = useQuery(LabelsQuery)

  if (loading) return <Loading />
  if (error) {
    return <ErrorPage title={error.message} />
  }
  console.log(data)
  return (
    <>
      <LabelItem label={label} userType='admin' />
      <LabelItem label={label} userType='admin' />
      <LabelItem label={label} userType='admin' />
      <LabelItem label={label} userType='admin' />
    </>
  )
}
