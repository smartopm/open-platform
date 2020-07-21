import React, { useState, useEffect } from 'react'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import { useQuery, useMutation } from 'react-apollo'
import { UserLabelsQuery, LabelsQuery } from '../graphql/queries'
import { LabelCreate, UserLabelCreate, UserLabelUpdate } from '../graphql/mutations'
import Autocomplete from '@material-ui/lab/Autocomplete'
import useDebounce from '../utils/useDebounce'
import { TextField, IconButton, Chip } from '@material-ui/core'

export default function UserLabels({ userId }) {
    const [showAddTextBox, setshowAddTextBox] = useState(false)
    const [label, setLabel] = useState('')
    const [selectedLabel, setSelectedLabel] = useState('')
    const newUserLabel = useDebounce(label, 500)
    const [labelCreate] = useMutation(LabelCreate)
    const [userLabelCreate] = useMutation(UserLabelCreate)
    const [userLabelUpdate] = useMutation(UserLabelUpdate)

    useEffect(() => {
        setLabel(newUserLabel)
    }, [newUserLabel])

    function createLabel(event) {
        if (event.key === "Enter") {
            labelCreate({
                variables: { shortDesc: newUserLabel }
            }).then(({ data }) => {
                LabelRefetch()
                return userLabelCreate({
                    variables: { userId, labelId: data.labelCreate.label.id }
                })
            }).then(() => userLabelRefetch())
        }
    }
    function handleDelete(id) {
        userLabelUpdate({
            variables: { userId, labelId: id }
        }).then(() => userLabelRefetch())
    }

    function handleLabelSelect(id) {
        userLabelCreate({
            variables: { userId, labelId: id }
        }).then(() => userLabelRefetch())
    }


    const { loading, error, data, refetch: LabelRefetch } = useQuery(LabelsQuery)
    const { loading: _loading, error: _error, data: userData, refetch: userLabelRefetch } = useQuery(UserLabelsQuery, {
        variables: { userId },
        errorPolicy: 'all'
    })


    if (loading || _loading) return 'loading'
    console.log({ error, _error })
    return (
        <div className="container">
            <div className=" row d-flex justifiy-content-around align-items-center">
                {userData.userLabels.length
                    ? userData.userLabels.map(label => (
                        <Chip
                            data-testid="chip-label"
                            key={label.id}
                            size="medium"
                            label={label.shortDesc}
                            onDelete={() => handleDelete(label.id)}
                        />
                    ))
                    : null}
                <IconButton
                    aria-label="add-label"
                    onClick={() => setshowAddTextBox(!showAddTextBox)}
                >
                    {!showAddTextBox ? <AddIcon /> : <CloseIcon />}
                </IconButton>
            </div>

            <div className=" row d-flex justifiy-content-around align-items-center">
                {showAddTextBox ? (
                    <Autocomplete
                        data-testid="userLabel-autoCreate"
                        style={{ width: '100%' }}
                        multiple
                        freeSolo
                        id="tags-filled"
                        options={data.labels}
                        getOptionLabel={option => option.shortDesc}
                        onChange={(event, newValue) => {
                            (newValue.map(id => handleLabelSelect(id.id)))
                        }}
                        renderTags={(value, getTagProps) => {
                            return value.map((option, index) => (
                                <Chip
                                    key={index}
                                    variant="outlined"
                                    label={option.shortDesc}
                                    {...getTagProps({ index })}
                                />

                            ))
                        }

                        }
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="User Label"
                                placeholder="Add Label"
                                onKeyDown={createLabel}
                                onChange={e => setLabel(e.target.value)}
                            />
                        )}
                    />
                ) : (
                        ''
                    )}
            </div>
        </div>
    )
}
