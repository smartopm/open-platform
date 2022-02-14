import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function CommentTextField({ value, setValue, handleSubmit, actionTitle }) {
  const { t } = useTranslation('common');
  return (
    <Grid container>
      <Grid item md={10} xs={8} style={{ paddingRight: '10px' }}>
        <TextField
          fullWidth
          id="standard-full-width"
          style={{ margin: 0 }}
          placeholder={t('common:misc.type_comment')}
          value={value}
          onChange={e => setValue(e.target.value)}
          multiline
          size="medium"
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
          inputProps={{ 'data-testid': 'body_input' }}
        />
      </Grid>
      <Grid item md={2} xs={4}>
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          disabled={!value.length}
          data-testid="comment_btn"
          style={{ height: '56px' }}
          onClick={handleSubmit}
          size="medium"
        >
          {actionTitle}
        </Button>
      </Grid>
    </Grid>
  );
}

CommentTextField.propTypes = {
  value: PropTypes.string.isRequired,
  actionTitle: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired
};
