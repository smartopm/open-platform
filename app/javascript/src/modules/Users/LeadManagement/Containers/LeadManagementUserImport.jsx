/* eslint-disable max-lines */
import React, { useState, useContext } from 'react';
import { useMutation } from 'react-apollo';
import { StyleSheet, css } from 'aphrodite';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import { ImportCreate } from '../../../../graphql/mutations';
import CenteredContent from '../../../../shared/CenteredContent';
import { Spinner } from '../../../../shared/Loading';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { csvValidate, readFileAsText } from '../../utils';
import PageWrapper from '../../../../shared/PageWrapper';
import { SnackbarContext } from '../../../../shared/snackbar/Context';

export default function UsersImport() {
  const [importCreate] = useMutation(ImportCreate);
  const [csvString, setCsvString] = useState('');
  const [csvFileName, setCsvFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const { token } = useContext(Context);
  const [CSVFileUploadErrors, setCSVFileUploadErrors] = useState([]);
  const { t } = useTranslation('common');

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  function createImport() {
    setIsLoading(true);
    importCreate({
      variables: { csvString, csvFileName, importType: 'lead' }
    })
      .then(() => {
        setIsLoading(false);
        showSnackbar({
          type: messageType.success,
          message: "Your import is currently being processed. You'll receive a mail when it's done."
        });
      })
      .catch(err => {
        setIsLoading(false);
        showSnackbar({type: messageType.error, message: err.message });
      });
  }

  function onCancel() {
    return history.push('/users');
  }

  function outputErrors(errorMessages) {
    if (errorMessages.length > 0) {
      errorMessages.forEach(invalidMessage => {
        document.getElementById('invalidMessages').insertAdjacentHTML('beforeend', invalidMessage);
      });
    }
  }

  async function processCsv(evt) {
    setCSVFileUploadErrors([]); // clear the errors to start with fresh state
    const file = evt.target.files[0];

    const errorMessages = await csvValidate(file);
    if (errorMessages) {
      setCSVFileUploadErrors(errorMessages);
      outputErrors(errorMessages);
    }

    document.getElementById('file-select-name').innerText = file.name; // set the name of the selected file

    if (!file) {
      setCsvString('');
      return;
    }

    const result = await readFileAsText(file);
    setCsvFileName(file.name);
    setCsvString(result);
  }

  return (
    <PageWrapper pageTitle={t('misc.lead_import')}>
      <Grid
        container
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <Grid item md={6} style={{ margin: '5px auto' }}>
          {isLoading ? (
            <Spinner />
        ) : (
          <div>
            <Grid container justifyContent="center" style={{ marginTop: '5px', marginBottom: '5px' }}>
              <Grid item md={12} xs={12} style={{ alignSelf: 'center' }}>
                <label htmlFor="lead-csv-input">
                  <input
                    accept=".csv"
                    type="file"
                    id="lead-csv-input"
                    data-testid="lead-csv-input"
                    style={{ display: 'none' }}
                    onChange={processCsv}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    data-testid="lead-csv-input-button"
                    component="span"
                    style={{ display: 'inline-block' }}
                  >
                    {t('lead_management.import_form_status_actions.upload_file')}
                  </Button>
                  <div style={{ display: 'inline-block', padding: '10px' }} id="file-select-name">
                    {t('lead_management.import_form_status_actions.choose_file')}
                  </div>
                </label>
                <br />
              </Grid>

              {CSVFileUploadErrors.length > 0 && (
                <Grid item md={12} xs={12}>
                  <div
                    style={{ color: 'red' }}
                    id="invalidMessages"
                    data-testid="lead-csv-errors"
                  />
                  <br />
                </Grid>
              )}
            </Grid>
            {csvString.length > 0 && CSVFileUploadErrors.length === 0 && (
              <CenteredContent>
                <Button
                  variant="contained"
                  aria-label="business_cancel"
                  color="secondary"
                  className={css(styles.cancelBtn)}
                  onClick={onCancel}
                  data-testid="cancel-btn"
                >
                  {t('lead_management.import_form_status_actions.cancel')}
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  aria-label="business_submit"
                  color="primary"
                  data-testid="import-btn"
                  onClick={createImport}
                  className={css(styles.importBtn)}
                >
                  {t('lead_management.import_form_status_actions.import')}
                </Button>
              </CenteredContent>
            )}
          </div>
        )}
        </Grid>
        <br />
        <Grid item md={6} style={{ alignSelf: 'center', marginLeft: '25px', marginRight: '25px' }}>
          You can upload a .csv file with multiple users. Below is a list of the expected column
          headers with examples (: i.e...).
          <br />
          <br />
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          You can click <a href={`/csv_import_sample/lead_download?token=${token}`}>here</a> to
          download a sample csv file.
          <br />
          <br />
          A sample CSV file can be
          {' '}
          <a href="https://docs.google.com/spreadsheets/d/1hNJU1lzeqUb5NGWRdUrAVqyDBwAIegwPgOb-HW2_8Ho/edit?usp=sharing">
            viewed here
          </a>
          . Copy the file to edit. Columns shown in green link to selectors in our system and
          require specific values. A list of these accepted values can be
          {' '}
          <a href="https://docs.google.com/spreadsheets/d/1OyBgj1QT3mpsiYElWfI_Cqtrwsw9h20YHVSVLELLpfY/edit?usp=sharing">
            viewed here
          </a>
          .
          <br />
          Note: If the column mapping does not match or the values are not recognized, the system
          will leave the input blank. Please review the uploaded users for import accuracy.
          <br />
          <br />
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
            <li>
              Country
              {' '}
              <a href="https://docs.google.com/spreadsheets/d/1OyBgj1QT3mpsiYElWfI_Cqtrwsw9h20YHVSVLELLpfY/edit?usp=sharing">
                accepted value list
              </a>
            </li>
            <li>
              Region
              {' '}
              <a href="https://docs.google.com/spreadsheets/d/1OyBgj1QT3mpsiYElWfI_Cqtrwsw9h20YHVSVLELLpfY/edit?usp=sharing">
                accepted value list
              </a>
            </li>
            <li>
              Industry Sector
              {' '}
              <a href="https://docs.google.com/spreadsheets/d/1OyBgj1QT3mpsiYElWfI_Cqtrwsw9h20YHVSVLELLpfY/edit?usp=sharing">
                accepted value list
              </a>
            </li>
            <li>
              Industry Sub Sector
              {' '}
              <a href="https://docs.google.com/spreadsheets/d/1OyBgj1QT3mpsiYElWfI_Cqtrwsw9h20YHVSVLELLpfY/edit?usp=sharing">
                accepted value list
              </a>
            </li>
            <li>
              Industry Business Activity
              {' '}
              <a href="https://docs.google.com/spreadsheets/d/1OyBgj1QT3mpsiYElWfI_Cqtrwsw9h20YHVSVLELLpfY/edit?usp=sharing">
                accepted value list
              </a>
            </li>
            <li>
              Level of Internationalization
              {' '}
              <a href="https://docs.google.com/spreadsheets/d/1OyBgj1QT3mpsiYElWfI_Cqtrwsw9h20YHVSVLELLpfY/edit?usp=sharing">
                accepted value list
              </a>
            </li>
            <li>Number of Employees</li>
            <li>Annual Revenue</li>
            <li>African Presence</li>
            <li>
              Lead Temperature
              {' '}
              <a href="https://docs.google.com/spreadsheets/d/1OyBgj1QT3mpsiYElWfI_Cqtrwsw9h20YHVSVLELLpfY/edit?usp=sharing">
                accepted value list
                {' '}
              </a>
            </li>
            <li>
              Lead Status
              {' '}
              <a href="https://docs.google.com/spreadsheets/d/1OyBgj1QT3mpsiYElWfI_Cqtrwsw9h20YHVSVLELLpfY/edit?usp=sharing">
                accepted value list
                {' '}
              </a>
            </li>
            <li>
              Lead Type
              {' '}
              <a href="https://docs.google.com/spreadsheets/d/1OyBgj1QT3mpsiYElWfI_Cqtrwsw9h20YHVSVLELLpfY/edit?usp=sharing">
                accepted value list
                {' '}
              </a>
            </li>
            <li>
              Lead Source
              {' '}
              <a href="https://docs.google.com/spreadsheets/d/1OyBgj1QT3mpsiYElWfI_Cqtrwsw9h20YHVSVLELLpfY/edit?usp=sharing">
                accepted value list
                {' '}
              </a>
            </li>
            <li>
              Client Category
              {' '}
              <a href="https://docs.google.com/spreadsheets/d/1OyBgj1QT3mpsiYElWfI_Cqtrwsw9h20YHVSVLELLpfY/edit?usp=sharing">
                accepted value list
                {' '}
              </a>
            </li>
            <li>Company Contacted</li>
            <li>Next Steps</li>
            <li>Lead Owner: i.e. John Doe </li>
            <li>Created By: i.e. John Doe </li>
            <li>Modified By: i.e. John Doe </li>
            <li>First Contact Date: i.e. 25-09-2020, 25/09/2020, 2020-09-25, 2020/09/25 </li>
            <li>Last Contact Date: i.e. 25-09-2020, 25/09/2020, 2020-09-25, 2020/09/25 </li>
            <li>Date Follow Up: i.e. 25-09-2020, 25/09/2020, 2020-09-25, 2020/09/25 </li>

            <li>Kick Off Date: i.e. 25-09-2020, 25/09/2020, 2020-09-25, 2020/09/25 </li>
            <li>Capex Amount: i.e. $45523455 </li>
            <li>Jobs: i.e. 200000 </li>
            <li>Jobs Timeline: i.e. 2 years </li>
            <li>Investment Size: i.e. 20 billion US dollars </li>
            <li>Investment Timeline: i.e. 5 years </li>
            <li>Decision Timeline: i.e. 6 months </li>
          </ol>
        </Grid>
      </Grid>
    </PageWrapper>
);
}

const styles = StyleSheet.create({
  cancelBtn: {
    width: '20%',
    marginRight: '8vw',
    height: 45,
    marginTop: 30,
    marginBottom: 5
  },
  importBtn: {
    width: '20%',
    height: 45,
    marginTop: 30,
    marginBottom: 5
  }
});
