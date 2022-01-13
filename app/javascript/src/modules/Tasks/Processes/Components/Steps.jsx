/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import StepItem from './StepItem';
import { objectAccessor } from '../../../../utils/helpers';

export default function ProjectSteps({
  data,
  setSelectedStep,
  handleStepCompletion
}) {
  const classes = useStyles();
  const [stepsOpen, setStepsOpen] = useState({});

  function toggleStep(stepItem){
    setStepsOpen({
      ...stepsOpen,
      [stepItem.id]: !objectAccessor(stepsOpen, stepItem.id)
    });
  }

  function handleStepItemClick(e, stepItem) {
    e.stopPropagation();
    setSelectedStep({ ...stepItem });
  }

  function handleOpenSubStepsClick(e, stepItem){
    e.stopPropagation();
    toggleStep(stepItem);
  }

  function handleStepComplete(e, stepItemId, completed) {
    e.stopPropagation();
    handleStepCompletion(stepItemId, completed)
  }

  return (
    <>
      {data?.length > 0 
      ? (data?.map(firstLevelStep => (
        <>
          <div
            className={classes.levelOne}
            key={firstLevelStep.id}
          >
            <StepItem
              key={firstLevelStep.id}
              step={firstLevelStep}
              clickable
              handleClick={(e) => handleStepItemClick(e, firstLevelStep)}
              styles={{backgroundColor: '#F5F5F4'}}
              openSubSteps={objectAccessor(stepsOpen, firstLevelStep.id)}
              handleOpenSubStepsClick={(e) => handleOpenSubStepsClick(e, firstLevelStep)}
              handleStepCompletion={handleStepComplete}
            />
          </div>
          {firstLevelStep?.subTasks?.length > 0 &&
            objectAccessor(stepsOpen, firstLevelStep.id) && (
              <>
                {firstLevelStep?.subTasks?.map(secondLevelStep => (
                  <div className={classes.levelTwo} key={secondLevelStep.id}>
                    <StepItem
                      key={secondLevelStep.id}
                      step={secondLevelStep}
                      styles={{backgroundColor: '#ECECEA'}}
                      clickable
                      handleClick={(e) => handleStepItemClick(e, secondLevelStep)}
                      handleStepCompletion={handleStepComplete}
                    />
                  </div>
                ))}
              </>
            )}
        </>
      )))
    :(<Typography data-testid="no-steps">No Stages currrently assigned to this process</Typography>)}
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
  
  ProjectSteps.defaultProps = {};

  ProjectSteps.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(Step)).isRequired,
  setSelectedStep: PropTypes.func.isRequired,
  handleStepCompletion: PropTypes.func.isRequired,
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
