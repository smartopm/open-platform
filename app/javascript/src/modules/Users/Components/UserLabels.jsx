import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { useQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, IconButton, Chip, Container, useTheme, useMediaQuery } from '@material-ui/core';
import { Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { UserLabelsQuery, LabelsQuery } from '../../../graphql/queries';
import { LabelCreate, UserLabelCreate, UserLabelUpdate } from '../../../graphql/mutations';
import useDebounce from '../../../utils/useDebounce';
import Loading from '../../../shared/Loading';
import { formatError, truncateString } from '../../../utils/helpers';
import MessageAlert from '../../../components/MessageAlert';
import ErrorPage from '../../../components/Error';

export default function UserLabels({ userId }) {
  const [showAddTextBox, setshowAddTextBox] = useState(false);
  const [label, setLabel] = useState('');
  const newUserLabel = useDebounce(label, 500);
  const [labelCreate] = useMutation(LabelCreate);
  const [userLabelCreate] = useMutation(UserLabelCreate);
  const [userLabelUpdate] = useMutation(UserLabelUpdate);
  const [messageAlert, setMessageAlert] = useState('');
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [isLabelOpen, setIsLabelOpen] = useState(false);
  const { t } = useTranslation(['common', 'label']);
  const classes = useStyles();
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.only('sm'));

  useEffect(() => {
    setLabel(newUserLabel);
  }, [newUserLabel]);

  function createLabel(event) {
    if (event.key === 'Enter') {
      labelCreate({
        variables: { shortDesc: newUserLabel }
      })
        .then(({ data }) => {
          LabelRefetch();
          return userLabelCreate({
            variables: { userList: userId, labelId: data.labelCreate.label.id }
          });
        })
        .then(() => userLabelRefetch())
        .catch(err => {
          setMessageAlert(formatError(err.message));
          setIsSuccessAlert(false);
        });
    }
  }
  function handleDelete(id) {
    userLabelUpdate({
      variables: { userId, labelId: id }
    }).then(() => userLabelRefetch());
  }

  function handleLabelSelect(id) {
    userLabelCreate({
      variables: { userList: userId, labelId: id }
    })
      .then(() => userLabelRefetch())
      .catch(error => <ErrorPage title={error.message} />); // do something useful with this error
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessageAlert('');
  }

  const { loading, error, data, refetch: LabelRefetch } = useQuery(LabelsQuery);
  const { loading: _loading, error: _error, data: userData, refetch: userLabelRefetch } = useQuery(
    UserLabelsQuery,
    {
      variables: { userId },
      errorPolicy: 'all'
    }
  );

  if (loading || _loading) return <Loading />;
  if (error || _error) {
    return <ErrorPage title={error.message || _error.message} />;
  }
  return (
    <div className="">
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <br />
      <Typography variant="subtitle1" className={classes.wrapIcon} onClick={() => setIsLabelOpen(!isLabelOpen)}>
        {t('label.labels')}
        {' '}
        {'  '}
        {
          isLabelOpen
          ? <KeyboardArrowUpIcon className={classes.linkIcon}  />
          : <KeyboardArrowDownIcon className={classes.linkIcon}  />
        }
      </Typography>
      <br />
      {isLabelOpen && (
        <Container maxWidth="xl">
          {userData.userLabels.length ? (
            userData?.userLabels.map(lab => (
              <Tooltip key={lab.id} title={lab.shortDesc} arrow>
                <Chip
                  data-testid="chip-label"
                  size="medium"
                  label={truncateString(lab.shortDesc, 12)}
                  onDelete={() => handleDelete(lab.id)}
                  style={{ marginRight: 5, marginBottom: 5 }}
                />
              </Tooltip>
            ))
          ) : (
            <span data-testid="no_labels">
              {
                matches ? t('label:label.no_labels') : t('label:label.no_user_labels')
              }
            </span>
          )}
          <IconButton
            aria-label="add-label"
            onClick={() => setshowAddTextBox(!showAddTextBox)}
            data-testid="add_label"
          >
            {!showAddTextBox ? (
              <AddIcon data-testid="add_label_closed" />
            ) : (
              <CloseIcon data-testid="add_label_open" />
            )}
          </IconButton>
        </Container>
      )}
      <div className="row d-flex justifiy-content-around align-items-center">
        {showAddTextBox ? (
          <Autocomplete
            data-testid="userLabel-autoCreate"
            style={{ width: '100%' }}
            multiple
            freeSolo
            id="tags-filled"
            options={data.labels}
            getOptionLabel={option => option.shortDesc}
            onChange={(event, newValue) => {
              // 2 things are happening here, there is a new value and an autocompleted value
              // if it is a new value then it is a string otherwise it is an array
              if (newValue.some(value => value.id != null)) {
                // if it is an array then it is wise to get the last item of the array
                const [lastLabel] = newValue.slice(-1);
                return handleLabelSelect(lastLabel.id);
              }
              return setLabel(newValue);
            }}
            renderTags={(value, getTagProps) => {
              return value.map((option, index) => (
                <Chip
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  variant="outlined"
                  label={option.shortDesc || option}
                  {...getTagProps({ index })}
                />
              ));
            }}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                label={t('common:misc.user_label')}
                placeholder={t('common:misc.add_label')}
                onKeyDown={createLabel}
                onChange={e => setLabel(e.target.value)}
              />
            )}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

UserLabels.propTypes = {
  userId: PropTypes.string.isRequired
};

const useStyles = makeStyles(() => ({
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex'
   },
   linkIcon: {
     marginTop: 3,
     marginLeft: 6
   }
}));
