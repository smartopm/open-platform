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
        })
        .then(() => userLabelRefetch())
        .catch(error => console.log(error.message)) // do something useful with this error
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
                            // 2 things are happening here, there is a new value and an autocompleted value
                            // if it is a new value then it is a string otherwise it is an array
                            if (newValue.some(value => value.id != null )) {
                                // if it is an array then it is wise to get the last item of the array
                                const [lastLabel] = newValue.slice(-1)
                                return handleLabelSelect(lastLabel.id)
                            }
                            return setLabel(newValue)
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
