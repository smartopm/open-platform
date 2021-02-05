import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField';

export default function DetailsField({ title, value }){
  return(
    <>
      <div>
        <TextField disabled id={`${value}-id`} inputProps={{'data-testid': 'text-field'}} style={{width: '350px', margin: '23px'}} label={title} value={value} />
      </div>
    </>
  )
}

DetailsField.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
}