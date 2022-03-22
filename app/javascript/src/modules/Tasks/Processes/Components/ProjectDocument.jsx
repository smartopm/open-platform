import React from 'react'
import { useQuery } from 'react-apollo';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography'
import CardWithDividers from '../../../../shared/CardWithDividers';
import { TaskDocumentsQuery } from '../../graphql/task_queries';
import { Spinner } from '../../../../shared/Loading';
import { dateToString } from '../../../../components/DateContainer';

export default function ProjectDocument({ taskId }) {
  const { data, loading, error, refetch } = useQuery(TaskDocumentsQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network'
  });
  return (
    <>
      {console.log(data.task?.attachments)}
      {loading ? <Spinner /> : (
        data.task?.attachments.map((att) => (
          <CardWithDividers key={att.id}>
            <Grid container>
              <Grid item md={5}>
                <Typography>{att.filename}</Typography>
              </Grid>
              <Grid item md={3}>
                <Typography>
                  Uploaded At:
                  {' '}
                  {dateToString(att.created_at)}
                </Typography>
              </Grid>
              <Grid item md={3}>
                <Typography>
                  Uploaded By:
                  {' '}
                  {att.uploaded_by}
                </Typography>
              </Grid>
              {/* <Grid item /> */}
            </Grid>
          </CardWithDividers>
        ))
      )}
    </>
  )
}