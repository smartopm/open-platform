import React from 'react';
import { Button, TextField } from '@material-ui/core'
import Loading from "./Loading";
import PropTypes from 'prop-types'

export default function CaptureTemp({ handleClick, handleTempInput, mutationLoading }) {
    
    return (

        <div className="row flex-row col" >
            <TextField required label="°C" className="tempvalue" variant="outlined"
                size="small" style={{ width: 80, marginRight: 30 }} InputLabelProps={{
                    shrink: true,
                }} onChange={handleTempInput} />

            <Button className="button" variant="contained" color="inherit" onClick={handleClick} >log temperature</Button>

            { mutationLoading && <Loading />  } 
             
        </div>

    );

}

CaptureTemp.propTypes = {

    handleClick: PropTypes.func.isRequired,
    handleTempInput: PropTypes.func.isRequired,
    mutationLoading: PropTypes.bool
}