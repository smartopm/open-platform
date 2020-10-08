/* eslint-disable no-use-before-define */
import React, { Fragment, useState } from 'react'
import { useMutation } from 'react-apollo'
import { StyleSheet, css } from 'aphrodite'
import { useHistory } from 'react-router-dom'
import { Button, Grid } from '@material-ui/core'
import Nav from '../components/Nav'
import { ImportCreate } from '../graphql/mutations'
import CenteredContent from '../components/CenteredContent'
import Loading from '../components/Loading'
import { sanitizeText } from '../utils/helpers'

export default function UsersImport() {
  const [importCreate] = useMutation(ImportCreate)
  const [csvString, setCsvString] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()

  function createImport() {
    setIsLoading(true)
    importCreate({
      variables: { csvString }
    })
      .then(res => {
        console.log(JSON.parse(res.data.usersImport.message))
        formatErrorMessage(JSON.parse(res.data.usersImport.message))
        setIsLoading(false)
      })
      .catch((err) => {
        setIsLoading(false)
        console.log(err.message)
      })
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

  function formatErrorMessage(messageObject) {
    let message = 'The following error(s) occurred, fix and try again: <br><br>'
    Object.keys(messageObject).forEach((row) => {
      message += `Row ${row}: <br>`
      messageObject[row].forEach(err => {
        message += `&nbsp; ${err} <br>`
      })
    })
    setErrorMessage(message)
  }

  return (
    <>
      <Nav navName="Bulk Import" menuButton="back" backTo="/users" />
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {errorMessage && (
            <div className={css(styles.errorContainer)}>
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeText(errorMessage)
                }}
              />
            </div>
          )}
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
          {csvString.length > 0 && !errorMessage && (
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
        </div>
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
    width: '201px',
    overflow: 'hidden'
  },

  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    maxHeight: '300px',
    overflowY: 'scroll',
    margin: '5vh 0 -20vh 0'
  }
})
