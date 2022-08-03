/* eslint-disable no-use-before-define */
import React from 'react'
import PropTypes from 'prop-types'
import {
  Menu,
  MenuItem,
} from '@mui/material'
import { StyleSheet, css } from 'aphrodite'
import { useTranslation } from 'react-i18next';
import colors from '../../../themes/nkwashi/colors'

const { clearDay } = colors
export default function RemindMeLaterMenu({
  open,
  handleClose,
  anchorEl,
  taskId,
  setTaskReminder
}) {
  const { t } = useTranslation(['task'])
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
            {t('task.task_reminder_in_1_hr')}
          </MenuItem>
          <MenuItem
            id="in_twenty_four_hours"
            key="in_twenty_four_hours"
            onClick={() =>
              setTaskReminder(24)}
            className={css(styles.menuItem)}
          >
            {t('task.task_reminder_in_24_hr')}
          </MenuItem>
          <MenuItem
            id="in_seventy_two_hours"
            key="in_seventy_two_hours"
            onClick={() =>
              setTaskReminder(72)}
            className={css(styles.menuItem)}
          >
            {t('task.task_reminder_in_72_hr')}
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
