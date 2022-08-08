/* eslint-disable complexity */
/* eslint-disable max-len */
/* eslint-disable max-lines */
import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, IconButton, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import Card from '../../../../shared/Card';
import { objectAccessor, removeNewLines, sanitizeText } from '../../../../utils/helpers';
import CustomProgressBar from '../../../../shared/CustomProgressBar';

export default function StepItem({
  step,
  clickable,
  handleClick,
  styles,
  openSubSteps,
  handleOpenSubStepsClick,
  updateStatus,
  handleStepCompletion
}) {
  const authState = React.useContext(AuthStateContext);
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:800px)');

  const taskPermissions = authState?.user?.permissions?.find((permission) => (
    permission.module === 'note'
  ));

  const canCompleteTask = taskPermissions.permissions.includes('can_mark_task_as_complete');

  return (
    <Card
      clickData={{clickable, handleClick}}
      styles={styles}
      contentStyles={{
        padding: '4px',
        cursor: objectAccessor(updateStatus, step.id) ? 'not-allowed' : 'pointer' }}
    >
      <Grid container>
        <Grid
          item
          md={11}
          xs={11}
          style={{ display: 'flex', alignItems: 'center' }}
          data-testid="step_body_section"
        >
          <Grid container style={{ display: 'flex', alignItems: 'center' }}>
            <Grid item md={2}>
              <IconButton
                aria-controls="process-check-box"
                aria-haspopup="true"
                data-testid="process-check-box"
                onClick={(e) => handleStepCompletion(e, step.id, !step.completed)}
                style={{backgroundColor: 'transparent', cursor: (canCompleteTask) ? 'pointer' : 'not-allowed' }}
                size="large"
                disabled={objectAccessor(updateStatus, step.id)}
              >
                { step.completed ? (
                  <CheckCircleIcon htmlColor="#4caf50" data-testid="task-completed-icon" />
                  ) : (
                    <CheckCircleOutlineIcon htmlColor="#9A9A9A" data-testid="task-not-completed-icon" />
                  )}
              </IconButton>
            </Grid>
            <Grid item md={5} xs={8}>
              <Typography
                variant="body2"
                data-testid="step_body"
                component="p"
                className={matches ? classes.taskBodyMobile : classes.taskBody}
              >
                <span
            // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
              __html: sanitizeText(removeNewLines(step.body))
            }}
                />
              </Typography>
            </Grid>

            {
              step?.subTasks?.length > 0 && (
              <Grid item md={3} xs={6}>
                <CustomProgressBar task={step} smDown={false} />
              </Grid>
            )}

          </Grid>
        </Grid>
        <Grid item md={1} xs={1} className={classes.subStepsSection} data-testid="show_step_sub_steps">
          {step?.subTasks?.length > 0
            && (
              <IconButton
                aria-controls="show-step-sub-steps-icon"
                aria-haspopup="true"
                onClick={(e) => handleOpenSubStepsClick(e)}
                data-testid="show-step-sub-steps-click-btn"
                size="large"
              >
                {openSubSteps
                  ? <KeyboardArrowUpIcon fontSize="small" color="primary" />
                  : <KeyboardArrowDownIcon fontSize="small" color="primary" />}
              </IconButton>
            )}
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
  updateStatus: {}
}
StepItem.propTypes = {
  step: PropTypes.shape(Step).isRequired,
  clickable: PropTypes.bool,
  handleClick: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object,
  openSubSteps: PropTypes.bool,
  handleOpenSubStepsClick: PropTypes.func,
  handleStepCompletion: PropTypes.func.isRequired,
  updateStatus: PropTypes.shape({
    message: PropTypes.string,
    success: PropTypes.bool,
  })
};

const useStyles = makeStyles(() => ({
  taskBody: {
    maxWidth: '70ch',
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
  subStepsSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderLeft: 'solid 1px rgba(0, 0, 0, 0.12)',
    '@media (min-device-width: 360px) and (max-device-height: 1368px) and (orientation: portrait)' : {
      justifyContent: 'center',
    },
  }
}));
