/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useLazyQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import StepItem from './StepItem';
import { objectAccessor } from '../../../../utils/helpers';
import { SubTasksQuery } from '../../graphql/task_queries';

export default function ProjectSteps({
  data,
  setSelectedStep,
  handleStepCompletion,
  handleProjectStepClick,
  redirect,
  clientView
}) {
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams();
  const [stepsOpen, setStepsOpen] = useState({});
  const [selectedSubStep, setSelectedSubStep] = useState(null);
  const { t } = useTranslation('task');

  const [
    loadSubSubSteps,
    { data: subSubStepsData }
  ] = useLazyQuery(SubTasksQuery, {
    variables: { taskId: selectedSubStep?.id, limit: selectedSubStep?.subTasksCount },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });


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
      history.push(`/processes/drc/projects/${id}?tab=processes`)
    }
  }

  function handleOpenSubStepsClick(e, stepItem){
    e.stopPropagation();
    setSelectedSubStep(stepItem)

    if(stepItem && stepItem?.subTasksCount > 0){
      loadSubSubSteps()
    }

    toggleStep(stepItem);
  }

  function handleStepComplete(e, stepItemId, completed) {
    e.stopPropagation();
    if(!clientView){
      handleStepCompletion(stepItemId, completed)
    }
  }
  return (
    <>
      {data?.length > 0
      ? (data?.map(firstLevelStep => (
        <Fragment key={firstLevelStep.id}>
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
              clientView={clientView}
            />
          </div>
          {subSubStepsData?.taskSubTasks?.length > 0 &&
            objectAccessor(stepsOpen, firstLevelStep.id) && (
              <>
                {subSubStepsData?.taskSubTasks?.map(secondLevelStep => (
                  <div className={classes.levelTwo} key={secondLevelStep.id}>
                    <StepItem
                      key={secondLevelStep.id}
                      step={secondLevelStep}
                      styles={{backgroundColor: '#ECECEA'}}
                      clickable
                      handleClick={(e) => handleStepItemClick(e, secondLevelStep)}
                      handleStepCompletion={handleStepComplete}
                      clientView={clientView}
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
    clientView: false,
    setSelectedStep: ()=> {}
  };

  ProjectSteps.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(Step)).isRequired,
  setSelectedStep: PropTypes.func,
  handleProjectStepClick: PropTypes.func.isRequired,
  handleStepCompletion: PropTypes.func.isRequired,
  redirect: PropTypes.bool,
  clientView: PropTypes.bool,
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
