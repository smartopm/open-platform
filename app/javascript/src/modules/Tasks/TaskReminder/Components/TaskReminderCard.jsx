/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useQuery } from 'react-apollo';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { AssignedTaskQuery } from '../graphql/task_reminder_query';
import { dateToString } from '../../../../utils/dateutil';
import CenteredContent from '../../../../shared/CenteredContent';
import { formatError, removeNewLines, sanitizeText } from '../../../../utils/helpers';
import EmptyCard from '../../../../shared/EmptyCard';
import Card from '../../../../shared/Card';
import CustomSkeleton from '../../../../shared/CustomSkeleton';
import CardWrapper from '../../../../shared/CardWrapper';

export default function TaskReminderCard({ translate }) {
  const matches = useMediaQuery('(max-width:600px)');
  const { loading, data, error } = useQuery(AssignedTaskQuery, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const history = useHistory();

  function checkDate(date) {
    if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
      return true;
    }
    return false;
  }

  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  return (
    <div style={matches ? { padding: '20px 0' } : { padding: '20px 0' }}>
      <CardWrapper
        title={translate('dashboard.task_reminders')}
        buttonName={translate('dashboard.see_more_reminders')}
        displayButton={data?.userTasks.length > 0}
        handleButton={() => history.push('/tasks?filter=myOpenTasks')}
      >
        {loading || data?.userTasks.length > 0 ? (
          (loading ? Array.from(new Array(5)) : data?.userTasks).map((tile, index) => (
            <div key={tile?.id || index}>
              {tile ? (
                <Card
                  clickData={{
                    clickable: true,
                    handleClick: () => history.push(`/tasks?taskId=${tile.id}`)
                  }}
                  styles={{borderRadius: '10px'}}
                >
                  <Grid container>
                    <Grid item md={3} xs={12}>
                      <div style={checkDate(tile.dueDate) ? { color: 'red' } : null}>
                        <Typography>
                          {translate('common:misc.due_text')} 
                          {' '}
                          {dateToString(tile.dueDate)}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item md={9} xs={12}>
                      <Typography align="justify" data-testid="body">
                        <span
                          style={{ whiteSpace: 'pre-line' }}
                          // eslint-disable-next-line react/no-danger
                          dangerouslySetInnerHTML={{
                            __html: sanitizeText(removeNewLines(tile.body))
                          }}
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              ) : (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index}>
                  <CustomSkeleton variant="rectangular" width="100%" height="50px" />
                </div>
              )}
            </div>
          ))
        ) : (
          <EmptyCard
            title={translate('dashboard.no_pending_tasks')}
            subtitle={translate('dashboard.pending_tasks_text')}
          />
        )}
      </CardWrapper>
    </div>
  );
}

TaskReminderCard.propTypes = {
  translate: PropTypes.func.isRequired
};
