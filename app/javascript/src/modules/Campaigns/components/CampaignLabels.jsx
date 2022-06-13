import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField, Chip } from '@mui/material';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { LabelsQuery } from '../../../graphql/queries';

export default function CampaignLabels({ handleLabelSelect }) {
  const { data } = useQuery(LabelsQuery);
  const { t } = useTranslation('campaign');

  return (
    <div>
      <>
        {data && (
          <Autocomplete
            data-testid="campaignLabel-creator"
            style={{ width: '100%', marginTop: 20 }}
            multiple
            freeSolo
            id="tags-filled"
            options={data.labels}
            getOptionLabel={option => option.shortDesc}
            onChange={(_event, newValue) => {
              return handleLabelSelect(newValue.shortDesc || newValue);
            }}
            renderTags={(values, getTagProps) => {
              return values.map((option, index) => (
                <Chip
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  variant="outlined"
                  label={option.shortDesc || option}
                  {...getTagProps({ index })}
                />
              ));
            }}
            renderInput={params => (
              <TextField
                {...params}
                label={t('form_fields.select_label')}
                style={{ width: '100%' }}
                variant='outlined'
              />
            )}
          />
        )}
      </>
    </div>
  );
}

CampaignLabels.defaultProps = {
  handleDelete: () => {}
};

CampaignLabels.propTypes = {
  handleLabelSelect: PropTypes.func.isRequired,
  handleDelete: PropTypes.func
};
