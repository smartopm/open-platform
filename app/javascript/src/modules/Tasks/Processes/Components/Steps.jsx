/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import StepItem from './StepItem';
import { objectAccessor, sortTaskOrder } from '../../../../utils/helpers';

export default function ProjectSteps({
  data,
  setSelectedStep,
  handleStepCompletion,
  handleProjectStepClick,
  redirect
}) {
  const authState = React.useContext(AuthStateContext);
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams();
  const [stepsOpen, setStepsOpen] = useState({});
  const { t } = useTranslation('task');

  const taskPermissions = authState?.user?.permissions?.find((permission) => (
    permission.module === 'note'
  ));

  const canAccessProjectSteps = taskPermissions.permissions.includes('can_access_project_steps');
  const canCompleteTask = taskPermissions.permissions.includes('can_mark_task_as_complete');

  function toggleStep(stepItem){
    setStepsOpen({
      ...stepsOpen,
      [stepItem.id]: !objectAccessor(stepsOpen, stepItem.id)
    });
  }

  function handleStepItemClick(e, stepItem) {
    e.stopPropagation();
    handleProjectStepClick(stepItem);
    setSelectedStep({ ...stepItem });
    if (redirect) {
      history.push(`/processes/projects/${id}?tab=processes`)
    }
  }

  function handleOpenSubStepsClick(e, stepItem){
    e.stopPropagation();

    toggleStep(stepItem);
  }

  function handleStepComplete(e, stepItemId, completed) {
    e.stopPropagation();
    if(canCompleteTask){
      handleStepCompletion(stepItemId, completed)
    }
  }

  return (
    <>
      {data?.length > 0
      ? (data?.sort(sortTaskOrder)?.map(firstLevelStep => (
        <Fragment key={firstLevelStep.id}>
          <div
            className={classes.levelOne}
            key={firstLevelStep.id}
          >
            <StepItem
              key={firstLevelStep.id}
              step={firstLevelStep}
              clickable={canAccessProjectSteps}
              handleClick={(e) => handleStepItemClick(e, firstLevelStep)}
              styles={{backgroundColor: '#F5F5F4', cursor: canAccessProjectSteps ? 'pointer' : 'not-allowed'}}
              openSubSteps={objectAccessor(stepsOpen, firstLevelStep.id)}
              handleOpenSubStepsClick={(e) => handleOpenSubStepsClick(e, firstLevelStep)}
              handleStepCompletion={handleStepComplete}
            />
          </div>
          {firstLevelStep?.subTasksCount > 0 &&
            objectAccessor(stepsOpen, firstLevelStep.id) && (
              <>
                {firstLevelStep?.subTasks?.sort(sortTaskOrder)?.map(secondLevelStep => (
                  <div className={classes.levelTwo} key={secondLevelStep.id}>
                    <StepItem
                      key={secondLevelStep.id}
                      step={secondLevelStep}
                      styles={{backgroundColor: '#ECECEA', cursor: canAccessProjectSteps ? 'pointer' : 'not-allowed'}}
                      clickable={canAccessProjectSteps}
                      handleClick={(e) => handleStepItemClick(e, secondLevelStep)}
                      handleStepCompletion={handleStepComplete}
                    />
                  </div>
                ))}
              </>
            )}
        </Fragment>
      )))
    :(<Typography data-testid="no-steps">{t('processes.no_steps_assigned')}</Typography>)}
    </>
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
    subTasks: PropTypes.arrayOf(PropTypes.object)
  };

  ProjectSteps.defaultProps = {
    redirect: false,
    setSelectedStep: ()=> {},
    data: []
  };

  ProjectSteps.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(Step)),
  setSelectedStep: PropTypes.func,
  handleProjectStepClick: PropTypes.func.isRequired,
  handleStepCompletion: PropTypes.func.isRequired,
  redirect: PropTypes.bool,
};

const useStyles = makeStyles(() => ({
  levelOne: {
    backgroundColor: '#f5f5f4',
    marginBottom: '8px',
  },
  levelTwo: {
    backgroundColor: '#ececea',
    marginLeft: '32px',
    marginBottom: '8px'
  }
}));
