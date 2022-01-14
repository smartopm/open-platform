import React, { useContext } from 'react'
import { Grid,Typography } from '@mui/material';
import { useQuery } from 'react-apollo';
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { TaskContext } from "../../Context";
import ProjectSteps from './Steps';
import { ProjectOpenTasksQuery } from '../../graphql/task_queries';
import { sanitizeText , formatError } from '../../../../utils/helpers';
import ProcessItem from './ProjectItem';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../shared/CenteredContent';


export default function ClientPilotViewItem({process}){
    const limit = 5;
    const  taskId  = process?.id
    const history = useHistory()

    const { data, error, loading, refetch } = useQuery(ProjectOpenTasksQuery, {
        variables: { taskId, limit },
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all'
      });

    const { handleStepCompletion } = useContext(TaskContext);

    function routeToProcessDetailsPage() {
      return history.push(`/processes/drc/projects/${taskId}?tab=processes`)
    }

    if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
    if (loading) return <Spinner />;
    return (
      <Grid container spacing={2}>
        <Grid item md={12} xs={12}>
          <Typography variant="h6">
            <span
                  // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                    __html: sanitizeText(process?.body)
                  }}
            />
          </Typography>
        </Grid>
        <Grid item md={12} xs={12} data-testid="project-container">
          <Grid container spacing={6} data-testid="project-open-tasks"> 
            <Grid item md={6} xs={12}>
              <Typography variant="h6">Your Tasks</Typography>
              <br />
              {data?.projectOpenTasks?.length?
                      (
                        <div>
                          {data?.projectOpenTasks.map(task => (
                            <ProcessItem key={task.id} task={task} refetch={refetch} clientView />
                        ))}
                        </div>
                      )
                      : (<Typography>Project does not have open tasks</Typography>)
                    }
            </Grid>

            <Grid item md={6} xs={12} data-testid="project-step-information">
              <Typography variant="h6">Process Steps</Typography>
              <br />
              <ProjectSteps
                data={process?.subTasks}
                setSelectedStep={routeToProcessDetailsPage}
                handleStepCompletion={(id, completed) => handleStepCompletion(id, completed, refetch)}
              />
            </Grid>

          </Grid>
      
        </Grid>

        <Grid item md={12} xs={12} style={{ marginBottom: '2px'}}><Divider /></Grid>
        
      </Grid>
    )
  }

  const Task = {
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

  ClientPilotViewItem.propTypes = {
    process: PropTypes.shape(Task).isRequired,

  }