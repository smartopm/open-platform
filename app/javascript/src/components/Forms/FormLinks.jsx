import React, { useContext } from 'react'
import {
  ListItem,
  ListItemAvatar,
  Divider,
  Typography,
  Box,
  Avatar
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import AssignmentIcon from '@material-ui/icons/Assignment'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'

// this is for existing google forms
export default function FormLinks() {
const authState = useContext(AuthStateContext)
// eslint-disable-next-line no-use-before-define
const classes = useStyles()
  return (
    <>
      <ListItem
        data-testid="forms-link-building-permit"
        style={{ marginTop: '8px' }}
        onClick={() => {
          window.open(
            'https://docs.google.com/forms/d/e/1FAIpQLSe6JmeKp9py650r7NQHFrNe--5vKhsXa9bFF9kmLAjbjYC_ag/viewform',
            '_blank'
          )
        }}
      >
        <ListItemAvatar data-testid="forms-link-building-icon">
          <Avatar>
            <AssignmentIcon />
          </Avatar>
        </ListItemAvatar>
        <Box className={classes.listBox}>
          <Typography variant="subtitle1" data-testid="forms-building-permit">
            Building Permit
          </Typography>
        </Box>
      </ListItem>

      <Divider variant="middle" />
      <ListItem
        data-testid="forms-link-crf"
        onClick={() => {
          window.open(
            `https://docs.google.com/forms/d/e/1FAIpQLSeC663sLzKdpxzaqzY2gdGAT5fe-Uc8lvLi1V7KdLfrralyeA/viewform?entry.568472638=${authState.user.name.replace(
              /\s+/g,
              '+'
            )}&entry.1055458143=${
              authState.user.phoneNumber ? authState.user.phoneNumber : ''
            }`,
            '_blank'
          )
        }}
      >
        <ListItemAvatar data-testid="forms-link-crf-icon">
          <Avatar>
            <AssignmentIcon />
          </Avatar>
        </ListItemAvatar>
        <Box className={classes.listBox}>
          <Typography variant="subtitle1" data-testid="forms-crf ">
            Client Request Form
          </Typography>
        </Box>
      </ListItem>
    </>
  )
}

export const useStyles = makeStyles({
  listBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginLeft: 30
  },
})