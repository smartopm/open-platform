import React, { useState, useRef } from 'react'
import {
  IconButton,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
} from '@mui/material'
import PropTypes from 'prop-types'
import useMediaQuery from '@mui/material/useMediaQuery';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from 'react-i18next';
import { objectAccessor } from '../../../utils/helpers'

export default function TaskQuickSearch({ filterTasks, currentTile }){
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const { t } = useTranslation('task')
  const matches = useMediaQuery('(max-width:800px)');

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
    setOpen(false);
    filterTasks(event, key)
  }

  function handleClick(event){
    filterTasks(event, currentTile)
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
    <div data-testid='task-quick-search'>
      {/* <ButtonGroup color="primary" ref={anchorRef} aria-label="outlined primary button group split button">
        <Button onClick={handleClick} disabled={!currentTile} style={matches ? {fontSize: '9px'} : {}}>{!currentTile ?  t('task.quick_search') : objectAccessor(tiles, currentTile)}</Button>
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
      </ButtonGroup> */}
      <IconButton ref={anchorRef} onClick={handleToggle} color='primary'><MoreVertIcon /></IconButton>
      <Popper open={open} anchorEl={anchorRef.current} transition style={{zIndex: 100}}>
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
                      selected={key === currentTile}
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
    </div>
  )
}

TaskQuickSearch.propTypes = {
  filterTasks: PropTypes.func.isRequired,
  currentTile: PropTypes.string.isRequired
}
