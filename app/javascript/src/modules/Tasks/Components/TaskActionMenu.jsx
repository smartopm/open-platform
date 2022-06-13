// This is the top menu for bulk operations

import React, { useState, useRef } from 'react';
import {
  Grid,
  Select,
  MenuItem,
  Typography,
  Button,
  Checkbox,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuList,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'
import { Spinner } from '../../../shared/Loading';
import { objectAccessor } from '../../../utils/helpers';

export default function TaskActionMenu({
  currentTile,
  setSelectAllOption,
  selectedTasks,
  taskListIds,
  checkedOptions,
  handleCheckOptions,
  bulkUpdating,
  handleBulkUpdate
}) {
  const { t } = useTranslation('common')

  return (
    <Grid container spacing={3}>
      {currentTile && (
        <Grid item style={{ display: 'flex' }}>
          <Grid>
            <Checkbox
              checked={selectedTasks.length === taskListIds.length || checkedOptions === 'all'}
              onChange={setSelectAllOption}
              name="select_all"
              data-testid="select_all"
              color="primary"
              style={{ padding: '0px', marginRight: '15px' }}
            />
          </Grid>
          <Typography>
            {' '}
            {t('misc.select')}
            {' '}
          </Typography>
          <Grid>
            <Select
              labelId="task-action-select"
              id="task-action-select"
              value={checkedOptions}
              onChange={handleCheckOptions}
              data-testid="select_option"
              style={{ height: '23px', marginLeft: '10px' }}
            >
              <MenuItem value="all">{t('misc.all')}</MenuItem>
              <MenuItem value="all_on_the_page">{t('misc.all_this_page')}</MenuItem>
              <MenuItem value="none">{t('misc.none')}</MenuItem>
            </Select>
          </Grid>
        </Grid>
      )}

      {(checkedOptions !== 'none' || selectedTasks.length > 0) && (
        <Grid item style={{ marginLeft: '20px', marginTop: '-4px' }}>
          {bulkUpdating ? (
            <Spinner />
          ) : (
            <Button
              onClick={handleBulkUpdate}
              color="primary"
              startIcon={
                currentTile === 'completedTasks' ? <CheckCircleOutlineIcon /> : <CheckCircleIcon />
              }
              style={{ textTransform: 'none' }}
              disabled={bulkUpdating}
              data-testid="bulk_update"
            >
              {`${currentTile === 'completedTasks' ? t('form_actions.note_incomplete') : t('form_actions.note_complete')} `}
            </Button>
          )}
        </Grid>
      )}
    </Grid>
  );
}

export function TaskQuickAction({
  checkedOptions,
  handleCheckOptions,
 }){
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState('');
  const anchorRef = useRef(null);
  const { t } = useTranslation('common')
  const matches = useMediaQuery('(max-width:800px)');
  const options = {
    all: t('misc.all'),
    'all_on_the_page': t('misc.all_this_page'),
    none: t('misc.none')
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleMenuItemClick(key){
    setSelectedKey(key)
    setOpen(false);
    handleCheckOptions(key)
  }

  return (
    <>
      <ButtonGroup color="primary" ref={anchorRef} aria-label="outlined primary button group split button">
        <Button style={matches ? {fontSize: '9px'} : { width: '159px'}}>
          {(checkedOptions === 'none')
          ? t('misc.select')
          :  objectAccessor(options, selectedKey)}
        </Button>
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
                <MenuList id="split-button-menu" data-testid="select_option">
                  {Object.entries(options).map(([key, val]) => (
                    <MenuItem
                      key={key}
                      selected={key === selectedKey}
                      onClick={() => handleMenuItemClick(key)}
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

export function TaskBulkUpdateAction({
  checkedOptions,
  bulkUpdating,
  handleBulkUpdate,
  currentTile,
  selectedTasks
}){
  const { t } = useTranslation('common')

  return (
    <>
      {(checkedOptions !== 'none' || selectedTasks.length > 0) && (
      <Grid item style={{ marginLeft: '20px', marginTop: '-4px' }}>
        {bulkUpdating ? (
          <Spinner />
          ) : (
            <Button
              onClick={handleBulkUpdate}
              color="primary"
              startIcon={
                currentTile === 'completedTasks' ? <CheckCircleOutlineIcon /> : <CheckCircleIcon />
              }
              style={{ textTransform: 'none' }}
              disabled={bulkUpdating}
              data-testid="bulk_update"
            >
              {`${currentTile === 'completedTasks' ? t('form_actions.note_incomplete') : t('form_actions.note_complete')} `}
            </Button>
          )}
      </Grid>
      )}
    </>
  )
}

TaskActionMenu.propTypes = {
    currentTile: PropTypes.string.isRequired,
    setSelectAllOption: PropTypes.func.isRequired,
    selectedTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
    taskListIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    checkedOptions: PropTypes.string.isRequired,
    handleCheckOptions: PropTypes.func.isRequired,
    bulkUpdating: PropTypes.bool.isRequired,
    handleBulkUpdate: PropTypes.func.isRequired
}


TaskQuickAction.propTypes = {
  checkedOptions: PropTypes.string.isRequired,
  handleCheckOptions: PropTypes.func.isRequired,
}

TaskBulkUpdateAction.propTypes = {
  currentTile: PropTypes.string.isRequired,
  selectedTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  checkedOptions: PropTypes.string.isRequired,
  bulkUpdating: PropTypes.bool.isRequired,
  handleBulkUpdate: PropTypes.func.isRequired
}
