import React, { useState, useEffect } from 'react'
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { useQuery, useMutation } from 'react-apollo'
import { UserLabelsQuery, LabelsQuery } from '../graphql/queries'
import {LabelCreate} from '../graphql/mutations'
import Autocomplete from "@material-ui/lab/Autocomplete";
import useDebounce from '../utils/useDebounce'
import {
    TextField,
    IconButton,
    Chip
} from '@material-ui/core'

export default function UserLabels({ userId }) {
    const [showAddTextBox, setshowAddTextBox] = useState(false)
    const [label, setLabel] = useState('')
    const newUserLabel = useDebounce(label, 500);
    const [labelCreate] = useMutation(LabelCreate)
    
    useEffect(
        () => {
            setLabel(newUserLabel)
        },
        [newUserLabel]
    );

    function createLabel(event){
        setLabel(event.target.value) 
        labelCreate({
            variables: { shortDesc: newUserLabel } }).then(() => {
            refetch()
        })
    }

    const { loading, error, data, refetch } = useQuery(LabelsQuery)

    if(loading) return "loading"
    const ulabels = [{
        id: "2345",
        shortDesc: "Client"
    }]
    return (
        <div className="container">
            <div className=" row d-flex justifiy-content-around align-items-center">
                {
                    ulabels.length ? ulabels.map(label => (
                        <Chip data-testid="chip-label" key={label.id} size="medium" label={label.shortDesc} />
                    ))
                        : null
                }
                <IconButton aria-label="add-label" onClick={() => setshowAddTextBox(!showAddTextBox)}>
                    {!showAddTextBox ? <AddIcon /> : <CloseIcon />}
                </IconButton>

            </div>

            <div className=" row d-flex justifiy-content-around align-items-center">
                {showAddTextBox ?
                    <Autocomplete
                    data-testid="userLabel-autoCreate"
                        style={{ width: "100%" }}
                        multiple
                        freeSolo
                        id="tags-filled"
                        options={data.labels.map(option => option.shortDesc)}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    variant="outlined"
                                    label={option}
                                    onChange={event => console.log(event.target.value)}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="User Label"
                                placeholder="Add Label"
                                onKeyDown={event =>createLabel(event)}
                            />
                        )}
                    />


                    : ''}
            </div>

        </div>
    )
}
