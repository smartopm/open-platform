// This is the top menu for bulk operations

import React from 'react';
import { Grid, Select, MenuItem, Typography, Button, Checkbox } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'
import { Spinner } from '../../../shared/Loading';

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
              {/* {`Mark as ${currentTile === 'completedTasks' ? 'Incomplete' : 'Complete'} `} */}
              {`${currentTile === 'completedTasks' ? t('form_actions.note_incomplete') : t('form_actions.note_complete')} `}
            </Button>
          )}
        </Grid>
      )}
    </Grid>
  );
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
