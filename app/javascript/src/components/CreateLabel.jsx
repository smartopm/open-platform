/* eslint-disable */
import React, { Fragment, useRef } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField, Chip } from '@material-ui/core'
import { useQuery, useMutation } from 'react-apollo'
import { LabelsQuery } from '../graphql/queries'
import { LabelCreate }from '../graphql/mutations';
import PropTypes from 'prop-types'

export default function CreateLabel({ handleLabelSelect, loading, setLoading, setMessage }) {
  const { data, loading: labelLoading, refetch } = useQuery(LabelsQuery);
  const [labelCreate] = useMutation(LabelCreate);
  const newLabels  = useRef([]);

  function updateNewLabels(descriptions) {
    // This method removes label from newLabels if a newly created label is deselected
    const removedLabels = [];
    newLabels.current.forEach(label => {
      if(!descriptions.includes(label.shortDesc)){
        removedLabels.push(label.shortDesc);
      }
    })

    removedLabels.forEach(label => {
      const index = newLabels.current.findIndex(newLabel => newLabel.shortDesc === label);
      newLabels.current.splice(index, 1);
    })
  }

  function updateDescriptions(descriptions){
    // This method updates the descriptions array when so that only label for only
    // new entered value by user is created
    newLabels.current.forEach(label => {
      const index = descriptions.findIndex(shortDesc => shortDesc === label.shortDesc);
      descriptions.splice(index, 1);
    })
  }

  function createLabel(shortDesc, index, size, currentLabels) {
    setLoading(true);
    labelCreate({
      variables: { shortDesc: shortDesc }
    })
    .then(({ data }) => {
      refetch();
      newLabels.current.push(data.labelCreate.label);
      if(index === size - 1){
        setLoading(false);
        handleLabelSelect(newLabels.current.concat(currentLabels));
      }
    })
    .catch(err => {
      console.log(err)
      setLoading(false);
      setMessage({
        isError: true,
        detail: err.message
      });
    });
  }

  return (
    <div>
      <Fragment>
        <Autocomplete
          data-testid="userLabel-creator"
          style={{ width: 250, margin: 1 }}
          multiple
          freeSolo
          loading={labelLoading}
          disabled={loading}
          id="tags-filled"
          options={data?.labels || []}
          getOptionLabel={option => option.shortDesc}
          onChange={(event, newValue) => {
            // 2 things are happening here, there is a new value and an autocompleted value
            // if it is a new value then it is a string otherwise it is an array
            if (newValue.every(value => value.id != null)) {
              // if it is an array then it is wise to get the last item of the array
              // const [lastLabel] = newValue.slice(-1)
              return handleLabelSelect(newValue)
            }else{
              const currentLabels = newValue.filter(value => value.id != null);
              const descriptions = newValue.filter(value => value.id == null);
              updateNewLabels(descriptions);
              updateDescriptions(descriptions);
              if(descriptions.length > 0){
                descriptions.forEach((shortDesc, index) => createLabel(shortDesc, index, descriptions.length, currentLabels));
              }else{
                handleLabelSelect(newLabels.current.concat(currentLabels));
              }
            }
          }}
          renderTags={(value, getTagProps) => {
            return value.map((option, index) => (
              <Chip
                data-testid="chip-label"
                key={index}
                variant="outlined"
                label={option.shortDesc || option}
                {...getTagProps({ index })}
              />
            ))}
          }
          renderInput={params => (
            <TextField
              {...params}
              data-testid="text-field"
              placeholder="Assign Label"
              style={{width: "100%"}}
              type='text'
            />
          )}
        />
      </Fragment>
    </div>
  )
}

CreateLabel.propTypes = {
  handleLabelSelect: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired
}