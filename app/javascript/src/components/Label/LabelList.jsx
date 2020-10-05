import React from 'react'
import { useQuery } from 'react-apollo'
import { LabelsQuery } from '../../graphql/queries'
import ErrorPage from '../Error'
import Loading from '../Loading'
import LabelItem from './LabelItem'

export default function LabelList({ userType }) {
  const { data, error, loading } = useQuery(LabelsQuery)

  if (loading) return <Loading />
  if (error) {
    return <ErrorPage title={error.message} />
  }
  console.log(data.labels[0].users)
  console.log(data.labels[0])
  return (
    <>
      {
        data.labels.map((label) => (
          <LabelItem 
            key={label.id} 
            label={label} 
            userType={userType}
            userCount={label.users.length}
          />
        ))
      }
    </>
  )
}
