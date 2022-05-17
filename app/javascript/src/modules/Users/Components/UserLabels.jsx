/* eslint-disable max-statements */
/* eslint-disable complexity */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import {
  TextField,
  IconButton,
  Chip,
  Container,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';

import { makeStyles } from '@mui/styles';
import { UserLabelsQuery, LabelsQuery } from '../../../graphql/queries';
import { LabelCreate, UserLabelCreate, UserLabelUpdate } from '../../../graphql/mutations';
import useDebounce from '../../../utils/useDebounce';
import { formatError, truncateString } from '../../../utils/helpers';
import MessageAlert from '../../../components/MessageAlert';
import ErrorPage from '../../../components/Error';
import CenteredContent from '../../../shared/CenteredContent';
import { Spinner } from '../../../shared/Loading';

export default function UserLabels({ userId, isLabelOpen }) {
  const [showAddTextBox, setshowAddTextBox] = useState(false);
  const [label, setLabel] = useState('');
  const newUserLabel = useDebounce(label, 500);
  const [labelCreate] = useMutation(LabelCreate);
  const [userLabelCreate] = useMutation(UserLabelCreate);
  const [userLabelUpdate] = useMutation(UserLabelUpdate);
  const [messageAlert, setMessageAlert] = useState('');
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const { t } = useTranslation(['common', 'label']);
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.only('sm'));
  const isMobile = useMediaQuery('(max-width:800px)');

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

  if (loading || _loading) return <Spinner />;
  const err = error || _error;

  if (err) return <CenteredContent>{formatError(err.message)}</CenteredContent>;
  return (
    <div className={classes.labelContainer}>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      {isLabelOpen && (
        <Container
          maxWidth="xl"
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {userData.userLabels.length ? (
            userData?.userLabels.map(lab => (
              <Tooltip key={lab.id} title={lab.shortDesc} arrow>
                {lab.groupingName ? (
                  <Chip
                    avatar={
                      // eslint-disable-next-line react/jsx-wrap-multilines
                      <Avatar
                        sx={{ height: '31px !important' }}
                        style={{
                          width: 'fit-content',
                          color: lab.color,
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                          borderTopLeftRadius: 16,
                          borderBottomLeftRadius: 16,
                          background: 'white',
                          borderColor: lab.color,
                          borderBottom: '1px solid',
                          borderTop: '1px solid',
                          borderLeft: '1px solid',
                          marginLeft: -1,
                          paddingLeft: 8,
                          paddingRight: 8
                        }}
                      >
                        {lab.groupingName}
                      </Avatar>
                    }
                    data-testid="chip-label"
                    size="small"
                    variant="outlined"
                    label={truncateString(lab.shortDesc, 12)}
                    onDelete={() => handleDelete(lab.id)}
                    style={{
                      marginRight: 5,
                      marginBottom: 5,
                      background: lab.color,
                      color: 'white',
                      height: '2rem'
                    }}
                  />
                ) : (
                  <Chip
                    data-testid="chip-label"
                    size="small"
                    variant="outlined"
                    label={truncateString(lab.shortDesc, 12)}
                    onDelete={() => handleDelete(lab.id)}
                    style={{
                      width: isMobile && '40%',
                      marginRight: 5,
                      marginBottom: 5,
                      paddingTop: '9px',
                      paddingBottom: '9px',
                      background: lab.color,
                      color: 'white',
                      height: '2rem'
                    }}
                  />
                )}
              </Tooltip>
            ))
          ) : (
            <span data-testid="no_labels">
              {matches ? t('label:label.no_labels') : t('label:label.no_user_labels')}
            </span>
          )}
        </Container>
      )}
      <div>
        <Container
          maxWidth="xl"
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <IconButton
            aria-label="add-label"
            onClick={() => setshowAddTextBox(!showAddTextBox)}
            data-testid="add_label"
            size="large"
          >
            {!showAddTextBox ? (
              <AddIcon data-testid="add_label_closed" />
            ) : (
              <CloseIcon data-testid="add_label_open" />
            )}
          </IconButton>
        </Container>
      </div>
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
  userId: PropTypes.string.isRequired,
  isLabelOpen: PropTypes.bool.isRequired
};

const useStyles = makeStyles(() => ({
  labelContainer: {
    marginTop: '10px'
  }
}));
