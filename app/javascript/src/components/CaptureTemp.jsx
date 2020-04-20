import React from 'react';
import { Button, TextField } from '@material-ui/core'
import PropTypes from 'prop-types'

export default function CaptureTemp({ handleClick, handleTempInput }) {

    return (
        <div>
            <div className="form-group row d-flex flex-row-reverse p-2" >
               
                <Button variant="contained" color="inherit" onClick={handleClick} >log temperature</Button>
                <TextField label="°C" id="filled-required" style = {{width: 100}} onChange={handleTempInput} />

            </div>

        </div>
    );

}

CaptureTemp.propTypes = {

    handleClick: PropTypes.func.isRequired,
    handleTempInput: PropTypes.func.isRequired
}