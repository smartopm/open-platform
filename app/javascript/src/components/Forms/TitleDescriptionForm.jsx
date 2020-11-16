/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Button, TextField, Snackbar } from '@material-ui/core'
import PropTypes from 'prop-types'
import { titleize } from '../../utils/helpers'

export default function TitleDescriptionForm({ save, type, close, data }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [open, setOpen] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    save(title, description)
  }

  return (
    <div className="container">
      <Snackbar
        color="success"
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(!open)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={`${titleize(type)} successfully created`}
      />
      <form
        onSubmit={handleSubmit}
        aria-label={`${type}-form`}
      >
        <TextField
          name="title"
          label={`${titleize(type)} Title`}
          style={{ width: '63vw' }}
          placeholder="Type a title here"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          margin="normal"
          inputProps={{
            'aria-label': `${type}_title`
          }}
          InputLabelProps={{
            shrink: true
          }}
          required
        />
        <TextField
          name="description"
          label={`${titleize(type)} Description`}
          style={{ width: '63vw' }}
          placeholder="Type a description here"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          multiline
          rows={3}
          margin="normal"
          inputProps={{
            'aria-label': `${type}_description`
          }}
          InputLabelProps={{
            shrink: true
          }}
          required
        />
        <br />
        <div className="d-flex row justify-content-center">
          <Button
            variant="contained"
            aria-label={`${type}_cancel`}
            color="secondary"
            onClick={close}
            className={`btn ${css(discussStyles.cancelBtn)}`}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={data.loading}
            aria-label={`${type}_submit`}
            className={`btn ${css(discussStyles.submitBtn)}`}
          >
            {data.loading ? 'Submitting ...' : 'Submit'}
          </Button>
        </div>
        <br />
        <p className="text-center">
          {Boolean(data.msg.length) && data.msg}
        </p>
      </form>
    </div>
  )
}

TitleDescriptionForm.propTypes = {
  close: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  data: PropTypes.shape({
      loading: PropTypes.bool,
      msg: PropTypes.string
  }).isRequired
}

export const discussStyles = StyleSheet.create({
  submitBtn: {
    width: '30%',
    boxShadow: 'none',
    marginTop: 50,
    alignItems: 'center',
    ':hover': {
      color: '#FFFFFF'
    }
  },
  cancelBtn: {
    width: '30%',
    marginRight: '20vw',
    marginTop: 50,
    alignItems: 'center',
    ':hover': {
      color: '#FFFFFF'
    }
  }
})
