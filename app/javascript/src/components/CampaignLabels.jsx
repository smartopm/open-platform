import React, { Fragment } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField, Chip } from '@material-ui/core'
import { useQuery } from 'react-apollo'
import { LabelsQuery } from '../graphql/queries'

export default function CampaignLabels({ handleLabelSelect }) {

    const { data } = useQuery(LabelsQuery)
 
    return (
        <div>
            <Fragment>
         
                {data && (<Autocomplete
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
                        return value.map((option, index) => (
                            <Chip
                                key={index}
                                variant="outlined"
                                label={option.shortDesc || option}
                                {...getTagProps({ index })}

                            />

                        ))
                    }
                    }
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Assign Label"
                            style={{ width: "100%" }}
                        />
                    )}
                />)}
            </Fragment>

        </div>
    )
}