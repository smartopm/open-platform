/* eslint-disable no-use-before-define */
import React, { useState, useContext } from 'react';
import { useMutation } from 'react-apollo';
import { StyleSheet, css } from 'aphrodite';
import { useHistory } from 'react-router-dom';
import { Button, Grid } from '@material-ui/core';
import CSVFileValidator from 'csv-file-validator';
import { ImportCreate } from '../../../../graphql/mutations';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import MessageAlert from '../../../../components/MessageAlert';
import configObject from './CSVFileValidatorConfig';

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
  const [CSVFileUploadErrors, setCSVFileUploadErrors] = useState([]);

  function createImport() {
    setIsLoading(true);
    importCreate({
      variables: { csvString, csvFileName, importType: 'lead' }
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
    CSVFileValidator(file, configObject).then(csvData => {
      setCSVFileUploadErrors(csvData.inValidMessages);
      if (csvData.inValidMessages.length > 0) {
        csvData.inValidMessages.forEach(invalidMessage => {
          document
            .getElementById('invalidMessages')
            .insertAdjacentHTML('beforeend', invalidMessage);
        });
      }
    });
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

  const hasErrors = CSVFileUploadErrors;

  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <Grid
        container
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <Grid item md={6} style={{ margin: '5px auto' }}>
          {isLoading ? (
            <Spinner />
          ) : (
            <div>
              <Grid container justify="center" style={{ marginTop: '5px', marginBottom: '5px' }}>
                <Grid item md={12} xs={12} style={{ alignSelf: 'center' }}>
                  <input
                    accept=".csv"
                    className={css(styles.inputField)}
                    id="contained-button-file"
                    data-testid="lead-csv-input"
                    type="file"
                    onChange={processCsv}
                  />
                  <br />
                  <br />
                </Grid>

                {CSVFileUploadErrors.length > 0 && (
                  <Grid item md={12} xs={12}>
                    <div className={css(styles.errorSection)} id="invalidMessages" />
                    <br />
                  </Grid>
                )}
              </Grid>
              {csvString.length > 0 && hasErrors.length === 0 && (
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
        <br />
        <Grid item md={6} style={{ alignSelf: 'center' }}>
          You can upload a .csv file with users. Below is a list of the expected column headers with
          examples(: i.e..). Download the sample CSV file to confirm column mapping and see the
          allowed values for the selectors.
          <br />
          Note: If the column mapping does not match or the values are not recognized, the system
          will leave the input blank. Please review the uploaded users for import accuracy.
          <ol>
            <li> Primary Contact Name: i.e John Doe </li>
            <li> Primary Contact Title </li>
            <li> Primary Contact Primary Email: i.e john@gmail.com </li>
            <li> Primary Contact Secondary Email: i.e john@gmail.com </li>
            <li> Primary Contact Primary Phone/Mobile: i.e 2609988776655 </li>
            <li> Primary Contact Secondary Phone/Mobile: i.e 2609988776655 </li>
            <li> Primary Contact Linkedin: </li>
            <li> Secondary Contact 1 Name: i.e John Doe </li>
            <li> Secondary Contact 1 Title: </li>
            <li> Secondary Contact 1 Primary Email: i.e john@gmail.com </li>
            <li> Secondary Contact 1 Secondary Email: i.e john@gmail.com </li>
            <li> Secondary Contact 1 Primary Phone/Mobile: i.e 2609988776655 </li>
            <li> Secondary Contact 1 Secondary Phone/Mobile: i.e 2609988776655 </li>
            <li> Secondary Contact 1 Linkedin: i.e </li>
            <li> Secondary Contact 2 Name: i.e John Doe </li>
            <li> Secondary Contact 2 Title: </li>
            <li> Secondary Contact 2 Primary Email: i.e john@gmail.com </li>
            <li> Secondary Contact 2 Secondary Email: i.e john@gmail.com </li>
            <li> Secondary Contact 2 Primary Phone/Mobile: i.e 2609988776655 </li>
            <li> Secondary Contact 2 Secondary Phone/Mobile: i.e 2609988776655 </li>
            <li> Secondary Contact 2 Linkedin: i.e </li>
            <li>Company Name</li>
            <li>Company Description</li>
            <li>Company Linkedin</li>
            <li>Company Website</li>
            <li>Relevant Link/News</li>
            <li>Country</li>
            <li>Region</li>
            <li>Industry Sector</li>
            <li>Industry Sub Sector</li>
            <li>Industry Business Activity</li>
            <li>Level of Internationlalization</li>
            <li>Number of Employees</li>
            <li>Annual Revenue</li>
            <li>African Presence</li>
            <li>Lead Temperature</li>
            <li>Lead Status</li>
            <li>Lead Type</li>
            <li>Lead Source</li>
            <li>Client Category</li>
            <li>Company Contacted</li>
            <li>Next Steps</li>
            <li>Lead Owner: i.e. John Doe </li>
            <li>Created By: i.e. John Doe </li>
            <li>Modified By: i.e. John Doe </li>
            <li>First Contact Date: i.e. 25-09-2020, 25/09/2020, 2020-09-25, 2020/09/25 </li>
            <li>Last Contact Date: i.e. 25-09-2020, 25/09/2020, 2020-09-25, 2020/09/25 </li>
            <li>Date Follow Up: i.e. 25-09-2020, 25/09/2020, 2020-09-25, 2020/09/25 </li>
          </ol>
          You can click <a href={`/csv_import_sample/lead_download?token=${token}`}>here</a> to
          download a sample csv file.
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
    marginTop: 30
  },

  importBtn: {
    width: '20%',
    height: 45,
    marginTop: 30
  },

  inputField: {
    width: '201px',
    overflow: 'hidden'
  },
  errorSection: {
    color: 'red'
  }
});
