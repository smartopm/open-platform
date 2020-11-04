import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { useQuery, useMutation } from 'react-apollo'
import Typography from '@material-ui/core/Typography';
import { CustomizedDialogs } from '../Dialog'
import { LabelsQuery } from '../../graphql/queries'
import { LabelMerge } from '../../graphql/mutations'
import ErrorPage from '../Error'

export default function MergeLabel({ open, handleClose, mergeData, refetch }) {
  const [labelValue, setLabelValue] = useState('')
  const [err, setErr] = useState(null)
  const { error, data } = useQuery(LabelsQuery)
  const [mergeLabel] = useMutation(LabelMerge)

  const textFieldOnChange = event => {
    setLabelValue(event.target.value)
  }

  const handleSubmit = event => {
    event.preventDefault()
    mergeLabel({
      variables: { labelId: mergeData.id, mergeLabelId: labelValue.id }
    }).then(() => {
      handleClose()
      refetch()
    }).catch((eror) => setErr(eror.message))
  }

  if (error) {
    return <ErrorPage title={error.message} />
  }

  return (
    <>
      {!data && (
        <p>Data not available</p>
      )}
      <CustomizedDialogs 
        open={open} 
        handleModal={handleClose}
        dialogHeader='Merging this label will move all users from this  label into the selected label'
        saveAction='merge'
        handleBatchFilter={handleSubmit}
      >
        <div style={{margin: '10px 30px', display: 'flex'}}>
          <Typography variant="body2" style={{margin: '20px 10px'}}>
            Merge this label into:
          </Typography>
          <TextField
            style={{width: '60%'}}
            value={labelValue}
            required
            onChange={textFieldOnChange}
            select
          >
            {data?.labels.filter(lab => lab.id !== mergeData.id).map(lab => (
              <MenuItem value={lab} key={lab.id}>{lab.shortDesc}</MenuItem>
            ))}
          </TextField>
        </div>
      </CustomizedDialogs>
      { err && <p>{err}</p> }
    </>
  )
}

MergeLabel.defaultProps = {
  mergeData: {}
 }
 MergeLabel.propTypes = {
  mergeData: PropTypes.shape({
      id: PropTypes.string,
      shortDesc: PropTypes.string
  }),
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired
}