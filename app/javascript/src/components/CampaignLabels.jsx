eslint-disable
import React, { Fragment, useState } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField, Chip } from '@material-ui/core'
import { useQuery } from 'react-apollo'
import { LabelsQuery } from '../graphql/queries'

export default function CampaignLabels({ handleLabelSelect, handleDelete }) {
    const { data } = useQuery(LabelsQuery)
    const [chipData, setChipData] = useState([])

    function handleChipDelete(chipId) {
        setChipData(chipData.filter(e => e.id !== chipId))
    }

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
                        return chipData.map((option, index) => (
                            <Chip
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
                            label="Assign Label"
                            style={{ width: "100%" }}
                        />
                    )}
                />)}
            </Fragment>

        </div>
    )
}