import React, { useContext } from 'react'
import {
  ListItem,
  ListItemAvatar,
  Divider,
  Typography,
  Box,
  Avatar
} from '@mui/material'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'


// this is for existing google forms
export default function FormLinks({ community, t }) {
const authState = useContext(AuthStateContext)

// eslint-disable-next-line no-use-before-define
const classes = useStyles()
if (community !== "Nkwashi") {
  return <span />
}
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
            {t('misc.building_permit')}
          </Typography>
        </Box>
      </ListItem>

      <Divider variant="middle" />
      <ListItem
        data-testid="forms-link-crf"
        onClick={() => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
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
            {t('misc.client_request_form')}
          </Typography>
        </Box>
      </ListItem>
    </>
);
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

FormLinks.propTypes = {
  community: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
}