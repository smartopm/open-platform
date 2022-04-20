import React from 'react';
import { Grid, Button, ListItem, ListItemText, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export default function SubmittedFileItem({
  attachment,
  translate,
  downloadFile,
  classes,
  legacyFile
}) {
  return (
    <ListItem style={{ paddingLeft: 0 }}>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item md={11} xs={8}>
          <ListItemText
            disableTypography
            primary={(
              <Typography
                variant="body1"
                color="primary"
                style={{ fontWeight: 700 }}
                data-testid="attachment_name"
              >
                {legacyFile.formProperty?.fieldName}
              </Typography>
            )}
            secondary={(
              <Typography component="span" variant="body2" data-testid="filename">
                {attachment.file_name || legacyFile.fileName}
              </Typography>
            )}
          />
        </Grid>
        <Grid item md={1} xs={4} className={classes.alignRight}>
          {(attachment?.file_name || legacyFile?.fileName) && (
            <Button
              aria-label="download-icon"
              data-testid="download-icon"
              variant="outlined"
              className={classes.buttonBg}
              onClick={event => downloadFile(event, attachment.image_url || legacyFile.imageUrl)}
            >
              {translate('common:misc.open')}
            </Button>
          )}
        </Grid>
      </Grid>
    </ListItem>
  );
}

SubmittedFileItem.defaultProps = {
  attachment: {},
  legacyFile: {}
};

SubmittedFileItem.propTypes = {
  attachment: PropTypes.shape({
    file_name: PropTypes.string,
    image_url: PropTypes.string
  }),
  legacyFile: PropTypes.shape({
    fileName: PropTypes.string,
    imageUrl: PropTypes.string,
    formProperty: PropTypes.shape({
      fieldName: PropTypes.string
    })
  }),
  translate: PropTypes.func.isRequired,
  downloadFile: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired
};
