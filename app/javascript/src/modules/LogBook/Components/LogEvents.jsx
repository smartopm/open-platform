import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MoreVertOutlined from '@material-ui/icons/MoreVertOutlined';
import PhotoIcon from '@material-ui/icons/Photo';
import { Spinner } from '../../../shared/Loading';
import { dateTimeToString, dateToString } from '../../../components/DateContainer';
import Label from '../../../shared/label/Label';
import { toTitleCase, objectAccessor } from '../../../utils/helpers';
import { LogLabelColors } from '../../../utils/constants';
import Card from '../../../shared/Card'
import { DetailsDialog } from '../../../components/Dialog';
import ImageUploadPreview from '../../../shared/imageUpload/ImageUploadPreview';

export default function LogEvents({ data, loading, error, refetch }) {
  const [imageOpen, setImageOpen] = useState(false);
  const [id, setId] = useState('')

  function handleClick(logId) {
    setId(logId)
    setImageOpen(true)
  }
  return (
    <>
      {console.log(data)}
      {loading ? (
        <Spinner />
      ) : (
        data.map(entry => (
          <>
            <Card key={entry.id}>
              <Grid container>
                <Grid item sm={5}>
                  {entry.entryRequest ? (
                    <>
                      <Typography color="primary">{entry.entryRequest?.name}</Typography>
                      <Grid container spacing={1}>
                        <Grid item sm={2}>
                          <Typography>Host:</Typography>
                        </Grid>
                        <Grid item sm={10}>
                          <Typography color="secondary">{entry.actingUser.name}</Typography>
                        </Grid>
                      </Grid>
                    </>
                ) : (
                  <Typography color='textSecondary'>{entry.data?.note}</Typography>
                )}
                </Grid>
                <Grid item sm={6} style={{ paddingTop: '7px' }}>
                  <Grid container spacing={1}>
                    <Grid item sm={3}>
                      <Typography color='textSecondary'>{dateToString(entry.createdAt)}</Typography>
                    </Grid>
                    <Grid item sm={2}>
                      <Typography color='textSecondary'>{dateTimeToString(entry.createdAt)}</Typography>
                    </Grid>
                    <Grid item sm={7}>
                      <Grid container spacing={1}>
                        {entry.entryRequest?.grantor && entry.data.note !== 'Exited' && (
                        <Grid item sm={6}>
                          <Label
                            title='Granted Access'
                            color="#77B08A"
                          />
                        </Grid>
                        )}
                        {entry.data.note === 'Exited' && (
                        <Grid item sm={6}>
                          <Label
                            title='Exit Logged'
                            color="#C4584F"
                          />
                        </Grid>
                        )}
                        {entry.subject === 'observation_log' && (
                        <Grid item sm={5}>
                          <Label
                            title='Observation'
                            color="#EBC64F"
                          />
                        </Grid>
                      )}
                        {entry.imageUrls && (
                        <Grid item sm={1}>
                          <IconButton color='primary' onClick={() => handleClick(entry.id)}>
                            <PhotoIcon />
                          </IconButton>
                        </Grid>
                      )}
                        {entry.entryRequest && entry.data.note !== 'Exited' && (
                        <Grid item sm={6}>
                          <Label
                            title={toTitleCase(entry.entryRequest?.reason)}
                            color={objectAccessor(LogLabelColors, entry.entryRequest?.reason)}
                          />
                        </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sm={1}>
                  <IconButton
                    aria-controls="sub-menu"
                    aria-haspopup="true"
                    // data-testid="subscription-plan-menu"
                    // dataid={subscription.id}
                    onClick={() => {}}
                  >
                    <MoreVertOutlined />
                  </IconButton>
                </Grid>
              </Grid>
            </Card>
            {imageOpen && (
              <DetailsDialog
                open={entry.id === id && imageOpen}
                handleClose={() => setImageOpen(false)}
                title='Attached Images'
              >
                <ImageUploadPreview
                  imageUrls={entry.imageUrls}
                  sm={6}
                  xs={6}
                  imgHeight='300px'
                />
              </DetailsDialog>
            )}
          </>
        ))
      )}
    </>
  );
}
