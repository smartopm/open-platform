import React, { useState, useRef } from 'react'
import {
  Grid,
  Typography,
  ButtonGroup,
  Button,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useTranslation } from 'react-i18next';
import TaskStatCard from './TaskStatCard'
import CenteredContent from '../../../components/CenteredContent'
import { objectAccessor } from '../../../utils/helpers'

export default function TaskDashboard({ taskData, filterTasks, currentTile }) {
  const { t } = useTranslation('task')

  const tiles = Object.freeze({
    myOpenTasks: t('task.my_tasks'),
    tasksDueIn10Days: t('task.tasks_due_in_10_days'),
    tasksDueIn30Days: t('task.tasks_due_in_30_days'),
    tasksOpenAndOverdue: t('task.overdue_tasks'),
    tasksWithNoDueDate: t('task.tasks_with_no_due_date'),
    totalCallsOpen: t('task.total_calls_open'),
    processes: t('task.total_forms_open'),
    tasksOpen: t('task.tasks_open'),
    completedTasks: t('task.tasks_completed')
  });

  if (taskData.loading || taskData.error) {
    return (
      <CenteredContent>
        <Typography
          align="center"
          color="textSecondary"
          gutterBottom
          variant="h6"
        >
          Loading
        </Typography>
      </CenteredContent>
    )
  }
  // use extra white space
  return Object.entries(tiles).map(([key, val]) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
      <TaskStatCard
        filter={evt => filterTasks(evt, key)}
        title={val}
        count={objectAccessor(taskData.data?.taskStats, key)}
        isCurrent={key === currentTile}
      />
    </Grid>
  ))
}

export function TaskQuickSearch({ filterTasks }){
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState('');
  const anchorRef = useRef(null);
  const { t } = useTranslation('task')

  const tiles = Object.freeze({
    myOpenTasks: t('task.my_tasks'),
    tasksDueIn10Days: t('task.tasks_due_in_10_days'),
    tasksDueIn30Days: t('task.tasks_due_in_30_days'),
    tasksOpenAndOverdue: t('task.overdue_tasks'),
    tasksWithNoDueDate: t('task.tasks_with_no_due_date'),
    totalCallsOpen: t('task.total_calls_open'),
    processes: t('task.total_forms_open'),
    tasksOpen: t('task.tasks_open'),
    completedTasks: t('task.tasks_completed')
  });

  function handleMenuItemClick(event, key){
    setSelectedKey(key)
    setOpen(false);
    filterTasks(event, key)
  }

  function handleClick(event){
    filterTasks(event, selectedKey)
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };


  return (
    <>
      <ButtonGroup color="primary" ref={anchorRef} aria-label="outlined primary button group split button">
        <Button onClick={handleClick} disabled={!selectedKey}>{!selectedKey ?  t('task.quick_search') : objectAccessor(tiles, selectedKey)}</Button>
        <Button
          color="primary"
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} transition>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {Object.entries(tiles).map(([key, val]) => (
                    <MenuItem
                      key={key}
                      selected={key === selectedKey}
                      onClick={(event) => handleMenuItemClick(event, key)}
                      value={key}
                    >
                      {val}
                    </MenuItem>
                    ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
          )}
      </Popper>
    </>
  )
}

TaskDashboard.propTypes = {
  taskData: PropTypes.shape({
    data: PropTypes.shape({
      taskStats: PropTypes.shape({
        myOpenTasks: PropTypes.number,
        tasksDueIn10Days: PropTypes.number,
        tasksDueIn30Days: PropTypes.number,
        tasksOpenAndOverdue: PropTypes.number,
        tasksWithNoDueDate: PropTypes.number,
        totalCallsOpen: PropTypes.number,
        processes: PropTypes.number,
        tasksOpen: PropTypes.number,
        completedTasks: PropTypes.number
      })
    })
  }).isRequired,
  filterTasks: PropTypes.func.isRequired,
  currentTile: PropTypes.string.isRequired
}

TaskQuickSearch.propTypes = {
  filterTasks: PropTypes.func.isRequired,
}
