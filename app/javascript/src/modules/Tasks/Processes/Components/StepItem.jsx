/* eslint-disable complexity */
/* eslint-disable max-len */
/* eslint-disable max-lines */
import React from 'react';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Grid, IconButton, Typography, Button } from '@material-ui/core';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Card from '../../../../shared/Card';


export function StepItem({
  step,
  clickable,
  handleClick,
  styles,
  openSubSteps,
  handleOpenSubStepsClick,
  handleStepCompletion
}) {
  const classes = useStyles();
  const { t } = useTranslation('task');
  const matches = useMediaQuery('(max-width:800px)');

  return (
    <Card clickData={{clickable, handleClick}} styles={styles} contentStyles={{ padding: '4px' }}>
      <Grid container>
        <Grid item md={5} xs={8} style={{ display: 'flex', alignItems: 'center' }} data-testid="task_body_section">
          <Button
            onClick={(e) => handleStepCompletion(e, step.id, !step.completed)}
            startIcon={
              step.completed ? <CheckCircleIcon htmlColor='#4caf50' /> : <CheckCircleOutlineIcon />
            }
            style={{ textTransform: 'none' }}
            data-testid="task_completion_toggle_button"
          />
          {step?.subTasks?.length > 0
            ? (
              <IconButton
                aria-controls="show-task-subtasks-icon"
                aria-haspopup="true"
                data-testid="show_task_subtasks"
                size="medium"
                onClick={(e) => handleOpenSubStepsClick(e)}
              >
                {openSubSteps
                  ? <KeyboardArrowUpIcon fontSize="small" color="primary" />
                  : <KeyboardArrowDownIcon fontSize="small" color="primary" />}
              </IconButton>
            ) : (
              <IconButton
                aria-controls="show-task-subtasks-icon"
                aria-haspopup="true"
                data-testid="show_task_subtasks"
                size="medium"
                disabled
              >
                <KeyboardArrowDownIcon fontSize="small" />
              </IconButton>
          )}
          <Typography
            variant="body2"
            data-testid="task_body"
            component="p"
            className={matches ? classes.taskBodyMobile : classes.taskBody}
          >
           {step.body}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
}

const Step = {
  id: PropTypes.string,
  body: PropTypes.string,
  completed: PropTypes.bool,
  author: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string
  }),
  assignees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  ),
  subTasks: PropTypes.arrayOf(PropTypes.object),
  dueDate: PropTypes.string
};

StepItem.defaultProps = {
  clickable: false,
  handleClick: null,
  styles: {},
  openSubSteps: false,
  handleOpenSubStepsClick: null,
}
StepItem.propTypes = {
  step: PropTypes.shape(Step).isRequired,
  clickable: PropTypes.bool,
  handleClick: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object,
  openSubSteps: PropTypes.bool,
  handleOpenSubStepsClick: PropTypes.func,
  handleStepCompletion: PropTypes.func.isRequired
};

const useStyles = makeStyles(() => ({
  taskBody: {
    maxWidth: '42ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '3px'
  },
  taskBodyMobile: {
    maxWidth: '17ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    paddingLeft: '3px'
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
    width: '45%',
    justifyContent: 'space-evenly'
  },
  iconItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  completed: {
    backgroundColor: '#4caf50',
    color: '#ffffff'
  },
  open: {
    backgroundColor: '#2196f3',
    color: '#ffffff'
  }
}));
