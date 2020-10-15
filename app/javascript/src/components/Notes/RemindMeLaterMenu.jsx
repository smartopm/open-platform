/* eslint-disable no-use-before-define */
import React from 'react'
import PropTypes from 'prop-types'
import {
  Menu,
  MenuItem,
} from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
import colors from '../../themes/nkwashi/colors'

const { clearDay } = colors
export default function RemindMeLaterMenu({
  open,
  handleClose,
  anchorEl,
  taskId,
  setTaskReminder
}) {

  return (
    <Menu
      id={`task-reminder-menu-${taskId}`}
      anchorEl={anchorEl}
      open={open}
      keepMounted
      onClose={handleClose}
      PaperProps={{
        style: {
          width: 200
        }
      }}
    >
      <div>
        <>
          <MenuItem
            id="in_one_hour"
            key="in_one_hour"
            onClick={() =>
              setTaskReminder(1)}
            className={css(styles.menuItem)}
          >
            In 1 hour
          </MenuItem>
          <MenuItem
            id="in_twenty_four_hours"
            key="in_twenty_four_hours"
            onClick={() =>
              setTaskReminder(24)}
            className={css(styles.menuItem)}
          >
            In 24 hours
          </MenuItem>
          <MenuItem
            id="in_seventy_two_hours"
            key="in_seventy_two_hours"
            onClick={() =>
              setTaskReminder(72)}
            className={css(styles.menuItem)}
          >
            In 72 hours
          </MenuItem>
        </>
      </div>
    </Menu>
  )
}

RemindMeLaterMenu.defaultProps = {
  anchorEl: {}
 }
 RemindMeLaterMenu.propTypes = {
  taskId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  setTaskReminder: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  anchorEl: PropTypes.object
}

const styles = StyleSheet.create({
  listItemIcon: {
    minWidth: '25px'
  },

  menuItem: {
    ':hover': {
      backgroundColor: clearDay
    }
  }
})
