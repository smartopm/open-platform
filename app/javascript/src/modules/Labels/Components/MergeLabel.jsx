import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useMutation, useLazyQuery } from 'react-apollo';
import Typography from '@mui/material/Typography';
import { CustomizedDialogs } from '../../../components/Dialog';
import { LabelsQuery } from '../../../graphql/queries';
import { LabelMerge } from '../../../graphql/mutations';
import ErrorPage from '../../../components/Error';

export default function MergeLabel({ open, handleClose, mergeData, refetch }) {
  const [labelValue, setLabelValue] = useState('');
  const [err, setErr] = useState(null);
  const [getLabels, { data, error }] = useLazyQuery(LabelsQuery);
  const [mergeLabel] = useMutation(LabelMerge);
  const { t } = useTranslation(['label', 'common']);

  const textFieldOnChange = event => {
    setLabelValue(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    mergeLabel({
      variables: { labelId: mergeData.id, mergeLabelId: labelValue.id }
    })
      .then(() => {
        handleClose();
        refetch();
      })
      .catch(eror => setErr(eror.message));
  };

  useEffect(() => {
    getLabels();
  }, []);
  
  if (error) {
    return <ErrorPage title={error.message} />;
  }

  return (
    <>
      {!data && <p>{t('common:misc.data_not_available')}</p>}
      <CustomizedDialogs
        open={open}
        handleModal={handleClose}
        dialogHeader={t('label.merge_dialog_title')}
        saveAction={t('common:form_actions.merge')}
        cancelAction={t('common:form_actions.cancel')}
        handleBatchFilter={handleSubmit}
      >
        <div style={{ margin: '10px 30px', display: 'flex' }}>
          <Typography variant="body2" style={{ margin: '20px 10px' }}>
            {t('label.merge_text')}
          </Typography>
          <TextField
            style={{ width: '60%' }}
            value={labelValue}
            required
            onChange={textFieldOnChange}
            select={!!data?.labels}
          >
            {data?.labels
              .filter(lab => lab.id !== mergeData.id)
              .map(lab => (
                <MenuItem value={lab} key={lab.id}>
                  {lab.shortDesc}
                </MenuItem>
              ))}
          </TextField>
        </div>
      </CustomizedDialogs>
      {err && <p>{err}</p>}
    </>
  );
}

MergeLabel.defaultProps = {
  mergeData: {}
};
MergeLabel.propTypes = {
  mergeData: PropTypes.shape({
    id: PropTypes.string,
    shortDesc: PropTypes.string
  }),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired
};
