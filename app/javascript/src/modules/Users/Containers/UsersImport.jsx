/* eslint-disable no-use-before-define */
import React, { useState, useContext } from 'react';
import { useMutation } from 'react-apollo';
import { StyleSheet, css } from 'aphrodite';
import { useHistory } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import { ImportCreate } from '../../../graphql/mutations';
import CenteredContent from '../../../components/CenteredContent';
import Loading from '../../../shared/Loading';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import MessageAlert from '../../../components/MessageAlert';

export default function UsersImport() {
  const [importCreate] = useMutation(ImportCreate);
  const [csvString, setCsvString] = useState('');
  const [csvFileName, setCsvFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const { token } = useContext(Context);
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');

  function createImport() {
    setIsLoading(true);
    importCreate({
      variables: { csvString, csvFileName, importType: 'user' }
    })
      .then(() => {
        setIsLoading(false);
        setMessageAlert(
          "Your import is currently being processed. You'll receive a mail when it's done."
        );
        setIsSuccessAlert(true);
      })
      .catch(err => {
        setIsLoading(false);
        setMessageAlert(err.message);
        setIsSuccessAlert(false);
      });
  }

  function onCancel() {
    return history.push('/users');
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessageAlert('');
  }

  function processCsv(evt) {
    const file = evt.target.files[0];
    if (errorMessage) setErrorMessage(null);

    if (!file) {
      setCsvString('');
      return;
    }
    const reader = new FileReader();
    setCsvFileName(file.name);
    // eslint-disable-next-line func-names
    reader.onload = function(e) {
      setCsvString(e.target.result);
    };
    reader.readAsText(file);
  }

  const hasErrors = errorMessage;

  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <Grid container style={{ margin: '5px auto', width: '95%' }}>
        <Grid item md={6}>
          You can upload a .csv file with users. The following are the expected fields with
          examples, and the column headers should be specified accordingly:
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
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          <a href={`/csv_import_sample/download?token=${token}`}>here</a> to download a sample csv
          file.
        </Grid>
        <Grid item md={6} style={{ margin: '5px auto' }}>
          {isLoading ? (
            <Loading />
        ) : (
          <div>
            <Grid container justifyContent="center" style={{ marginTop: '200px' }}>
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
                  data-testid="cancel-btn"
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
);
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
  }
});
