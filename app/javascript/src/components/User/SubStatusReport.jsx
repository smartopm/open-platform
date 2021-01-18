import React from 'react'
import PropTypes from 'prop-types'
import {
  ListItemText,
  ListItemSecondaryAction,
  ListItem,
  List
} from '@material-ui/core'

const status = {
  applied: 'Applied',
  approved: 'Applied',
  architectureReviewed: 'Architecture Reviewed',
  interested: 'Interested',
  built: 'Built',
  contracted: 'Contracted',
  inConstruction: 'In Construction',
  movedIn: 'Moved In',
  paying: 'Paying',
  readyForConstruction: 'Ready For Construction'
}

export default function SubStatusReport() {
  const data = []
  const propAccess = () => {}
  return (
    <List>
      {Object.entries(status).map(([key, val]) => (
        <StatusCount key={status} count={propAccess(data.substatusQuery, key)} title={val} />
      ))}
    </List>
  )
}

export function StatusCount({ title, count }) {
  return (
    <ListItem>
      <ListItemText primary={title} />
      <ListItemSecondaryAction>{count}</ListItemSecondaryAction>
    </ListItem>
  )
}

StatusCount.propTypes = {
    title: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
}