import React, { useState, useEffect } from 'react'
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import useDebounce  from '../utils/useDebounce' 
import {
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    IconButton,
    Chip
} from '@material-ui/core'

export default function UserLabels({ labels }) {
    const [showAddTextBox, setshowAddTextBox] = useState(false)
    const [label, setLabel] = useState('')
    const newUserLabel = useDebounce(label, 500); 

    useEffect(
        () => {
            setLabel(newUserLabel)
        },
        [newUserLabel]
      );

      console.log(label);

    return (
        <div className="container">
            <div className=" row d-flex justifiy-content-around align-items-center">

                <Chip size="medium" label="Basic" />
                <IconButton aria-label="add-label" onClick={() => setshowAddTextBox(!showAddTextBox)}>
                    {!showAddTextBox ? <AddIcon /> : <CloseIcon />}
                </IconButton>

            </div>

            <div className=" row d-flex justifiy-content-around align-items-center">
                {showAddTextBox ?

                    <FormControl style={{ width: '100%' }}>
                        <InputLabel id="demo-mutiple-chip-label">Add new label</InputLabel>
                        <Input
                            variant="outlined"
                            onChange={event => setLabel(event.target.value)}
                            startAdornment={
                                <InputAdornment>
                                    <Chip label="Admin" size="medium" />
                                    <Chip label="Admin" size="medium" />
                                </InputAdornment>
                            }>

                        </Input>

                    </FormControl>


                    : ''}
            </div>

        </div>
    )
}
