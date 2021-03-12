import React from 'react'
import LabelItem from '../app/javascript/src/components/Label/LabelItem'

export default {
    title: 'Label/LabelItem',
    component: LabelItem
}

export const Primary = () => (
  <LabelItem
    key='key'
    label='label'
    userType='admin'
    userCount='10'
    refetch={false}
  />
)
