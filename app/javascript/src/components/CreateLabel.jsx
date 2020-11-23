/* eslint-disable */
import React, { Fragment, } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField, Chip } from '@material-ui/core'
import { useQuery } from 'react-apollo'
import { LabelsQuery } from '../graphql/queries'

export default function CreateLabel({ handleLabelSelect }) {
    const { data } = useQuery(LabelsQuery)
    return (
        <div>
            <Fragment>
                <Autocomplete
                    data-testid="userLabel-creator"
                    style={{ width: 250, margin: 1 }}
                    multiple
                    freeSolo
                    id="tags-filled"
                    options={data.labels}
                    getOptionLabel={option => option.shortDesc}
                    onChange={(event, newValue) => {
                        // 2 things are happening here, there is a new value and an autocompleted value
                        // if it is a new value then it is a string otherwise it is an array
                        if (newValue.some(value => value.id != null)) {
                            // if it is an array then it is wise to get the last item of the array
                            const [lastLabel] = newValue.slice(-1)
                            return handleLabelSelect(lastLabel)
                        }

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
                            placeholder="Assign Label"
                            style={{width: "100%"}}

                        />
                    )}
                />
            </Fragment>
        </div>
    )
}
