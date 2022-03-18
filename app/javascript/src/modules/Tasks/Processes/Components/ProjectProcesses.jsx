import React, { useContext } from 'react'
import PropTypes from 'prop-types';
import { Grid, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import { TaskContext } from "../../Context";
import ProjectSteps from './Steps';
import ProjectActivitySummary from './ProjectActivitySummary';

export default function ProjectProcesses({
  data,
  refetch,
  handleProjectStepClick,
  comments,
  commentsLoading,
  commentsError,
  commentsRefetch,
  commentsFetchMore,
  showCommentsMobile,
 }){
  const classes = useStyles();
  const { setSelectedStep, handleStepCompletion } = useContext(TaskContext);
  const { t } = useTranslation('task');

  return (
    <>
      <Grid container direction="column">
        <Grid item xs={12} className={classes.activitySummary}>
          <ProjectActivitySummary
            comments={comments}
            commentsLoading={commentsLoading}
            commentsError={commentsError}
            commentsRefetch={commentsRefetch}
            commentsFetchMore={commentsFetchMore}
            showCommentsMobile={showCommentsMobile}
          />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid item xs={12} className={classes.processSteps}>
        <Typography
          variant="subtitle1"
          className={classes.processesHeader}
          data-testid="processes-header"
        >
          {t('processes.process_steps')}
        </Typography>
        <ProjectSteps
          data={data}
          setSelectedStep={setSelectedStep}
          handleProjectStepClick={handleProjectStepClick}
          handleStepCompletion={(id, completed) => handleStepCompletion(id, completed, refetch)}
        />
      </Grid>
    </>
  )
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
  dueDate: PropTypes.string,
  formUserId: PropTypes.string
}
ProjectProcesses.defaultProps = {
  commentsError: null,
  comments: null,
  showCommentsMobile: () => {},
}

ProjectProcesses.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(Step)).isRequired,
  refetch: PropTypes.func.isRequired,
  handleProjectStepClick: PropTypes.func.isRequired,
  comments: PropTypes.shape({
    projectComments: PropTypes.array
  }),
  commentsLoading: PropTypes.bool.isRequired,
  commentsError: PropTypes.shape({
    message: PropTypes.string
  }),
  commentsRefetch: PropTypes.func.isRequired,
  commentsFetchMore: PropTypes.func.isRequired,
  showCommentsMobile: PropTypes.func
}

const useStyles = makeStyles(() => ({
  activitySummary: {
    marginBottom: '32px !important',
  },
  divider: {
    height: '0px'
  },
  processSteps: {
    marginTop: '20px'
  },
  processesHeader: {
    marginBottom: '32px !important',
    marginTop: '32px !important',
    fontWeight: 200
  }
}));
