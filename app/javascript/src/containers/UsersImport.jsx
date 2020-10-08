/* eslint-disable no-use-before-define */
import React, { Fragment, useState } from 'react'
import { useMutation } from 'react-apollo'
import { StyleSheet, css } from 'aphrodite'
import { useHistory } from 'react-router-dom'
import { Button, Grid } from '@material-ui/core'
import Nav from '../components/Nav'
import { ImportCreate } from '../graphql/mutations'
import CenteredContent from '../components/CenteredContent'

export default function UsersImport() {
  const [importCreate] = useMutation(ImportCreate)
  const [csvString, setCsvString] = useState('')
  const history = useHistory()

  function createImport() {
    importCreate({
      variables: { csvString }
    })
      .then(res => {
        console.log(res)
      })
      .catch(err => console.log(err.message))
  }

  function onCancel() {
    return history.push('/users')
  }

  function processCsv(evt) {
    const file = evt.target.files[0]
    if (!file) {
      setCsvString('')
      return
    }
    const reader = new FileReader()
    reader.onload = function(e) {
      console.log('strinnnn', e.target.result)
      setCsvString(e.target.result)
    }
    reader.readAsText(file)
  }

  return (
    <>
      <Nav navName="Bulk Import" menuButton="back" backTo="/users" />
      <Grid container justify="center" style={{ marginTop: '200px' }}>
        <input
          accept=".csv"
          className={css(styles.inputField)}
          id="contained-button-file"
          type="file"
          onChange={processCsv}
        />
      </Grid>
      <br />
      {csvString.length && (
        <CenteredContent>
          <Button
            variant="contained"
            aria-label="business_cancel"
            color="secondary"
            className={css(styles.cancelBtn)}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            aria-label="business_submit"
            color="primary"
            onClick={createImport}
            className={css(styles.importBtn)}
          >
            Import
          </Button>
        </CenteredContent>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  cancelBtn: {
    width: '20%',
    marginRight: '8vw',
    height: 45,
    marginTop: 50
  },

  importBtn: {
    width: '20%',
    height: 45,
    marginTop: 50
  },

  inputField: {
    width: '201px'
  }
})
