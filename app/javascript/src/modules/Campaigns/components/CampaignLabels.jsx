import React, { useState } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField, Chip } from '@material-ui/core'
import { useQuery } from 'react-apollo'
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types'
import { LabelsQuery } from '../../../graphql/queries'

export default function CampaignLabels({ handleLabelSelect, handleDelete }) {
    const { data } = useQuery(LabelsQuery)
    const [chipData, setChipData] = useState([])
    const { t } = useTranslation('campaign');
    function handleChipDelete(chipId) {
        setChipData(chipData.filter(e => e.id !== chipId))
    }

    return (
      <div>
        <>
          {data && (
            <Autocomplete
              data-testid="campaignLabel-creator"
              style={{ width: "100%", marginTop: 20 }}
              multiple
              freeSolo
              id="tags-filled"
              options={data.labels}
              getOptionLabel={option => option.shortDesc}
              onChange={(_event, newValue) => {
                        return handleLabelSelect(newValue.shortDesc || newValue)
                    }}
              renderTags={(value, getTagProps) => {
                        return chipData.map((option, index) => (
                          <Chip
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            variant="outlined"
                            label={option.shortDesc || option}
                            {...getTagProps({ index })}
                            onDelete={() => {
                                    handleDelete(option.id)
                                    handleChipDelete(option.id)
                                }}
                          />
                        ))
                    }
                    }
              renderInput={params => (
                <TextField
                  {...params}
                  label={t('form_fields.assign_label')}
                  style={{ width: "100%" }}
                />
                    )}
            />
)}
        </>

      </div>
    )
}

CampaignLabels.defaultProps = {
  handleDelete: () => {}
}

CampaignLabels.propTypes = {
    handleLabelSelect: PropTypes.func.isRequired,
    handleDelete: PropTypes.func,
}