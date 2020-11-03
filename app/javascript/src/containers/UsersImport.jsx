/* eslint-disable no-use-before-define */
import React, { useState, useContext } from 'react'
import { useMutation } from 'react-apollo'
import { StyleSheet, css } from 'aphrodite'
import { useHistory } from 'react-router-dom'
import { Button, Grid } from '@material-ui/core'
import Nav from '../components/Nav'
import { ImportCreate } from '../graphql/mutations'
import CenteredContent from '../components/CenteredContent'
import Loading from '../components/Loading'
import { sanitizeText, pluralizeCount } from '../utils/helpers'
import { Context } from "./Provider/AuthStateProvider"

export default function UsersImport() {
  const [importCreate] = useMutation(ImportCreate)
  const [csvString, setCsvString] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorSummary, setErrorSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const history = useHistory()
  const { token } = useContext(Context)

  function createImport() {
    setIsLoading(true)
    importCreate({
      variables: { csvString }
    })
      .then(res => {
        formatResponseMessage(res.data.usersImport)
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
      })
  }

  function onCancel() {
    return history.push('/users')
  }

  function processCsv(evt) {
    const file = evt.target.files[0]
    if (errorMessage) setErrorMessage(null)
    if (errorSummary) setErrorSummary(null)

    if (!file) {
      setCsvString('')
      return
    }
    const reader = new FileReader()
    reader.onload = function(e) {
      setCsvString(e.target.result)
    }
    reader.readAsText(file)
  }

  function formatResponseMessage({
    errors,
    noOfDuplicates,
    noOfInvalid,
    noOfValid
  }) {
    if (noOfDuplicates + noOfInvalid === 0) {
      setErrorMessage('Import was successful')
      return
    }

    if (noOfDuplicates > 0) {
      setErrorSummary(
        `${duplicateStatement(noOfDuplicates)},
        ${noOfValid} ${pluralizeCount(noOfValid, 'user')} will be added,
        ${invalidStatement(noOfInvalid)}.`
      )
    }

    const parsedErrors = JSON.parse(errors)
    const errorRows = Object.keys(parsedErrors)
    if (errorRows.length > 0) {
      let message = ''
      errorRows.forEach(row => {
        message += `Row ${row}: <br>`
        parsedErrors[row].forEach(err => {
          message += `&nbsp; ${err} <br>`
        })
      })
      setErrorMessage(message)
    }
  }

  function duplicateStatement(duplicatesNumber) {
    let statement = `${duplicatesNumber} user already exists`
    if (duplicatesNumber > 1) {
      statement = `${duplicatesNumber} users already exist`
    }
    return statement
  }

  function invalidStatement(invalidNumber) {
    let statement = `${invalidNumber} user has errors`
    if (invalidNumber > 1) {
      statement = `${invalidNumber} users have errors`
    }
    return statement
  }

  const hasErrors = errorMessage || errorSummary

  return (
    <>
      <Nav navName="Bulk Import" menuButton="back" backTo="/users" />
      <Grid container style={{margin: '5px auto', width: '95%'}}>
        <Grid item md={6}>
          You can upload a .csv file with users. The following are the expected
          fields with examples, and the column headers should be specified accordingly:
          <ol>
            <li> Name: i.e John Doe </li>
            <li> Email primary: i.e john@gmail.com </li>
            <li> Phone number primary: i.e 260666050378 </li>
            <li> Phone number secondary 1: i.e 260999050378 </li>
            <li> Phone number secondary 2: i.e +260777050378 </li>
            <li> User type: i.e client, prospective client, visitor, admin, etc. </li>
            <li> Labels: i.e import, facebook </li>
            <li> State: i.e valid, pending, banned, expired </li>
            <li> Expiration date: i.e 25-09-2020, 25/09/2020, 2020-09-25, 2020/09/25 </li>
            <li> Notes on client: i.e Here&apos;s a new note </li>
          </ol>
          You can click
          {' '}
          <a href={`/csv_import_sample/download?token=${token}`}>here</a>
          {' '}
          to
          download a sample csv file.
        </Grid>
        <Grid item md={6} style={{margin: '5px auto'}}>
          {isLoading ? (
            <Loading />
      ) : (
        <div>
          <div className="text-center">{errorSummary}</div>
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
              data-testid="csv-input"
              type="file"
              onChange={processCsv}
            />
          </Grid>
          <br />
          {csvString.length > 0 && !hasErrors && (
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
        </Grid>
      </Grid>
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
