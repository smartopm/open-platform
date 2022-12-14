/* eslint-disable complexity */
import React, { useContext, useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useMutation } from 'react-apollo';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMediaQuery, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import CenteredContent from '../../../../shared/CenteredContent';
import GuestTime from '../../Components/GuestTime';
import InvitationCreateMutation from '../graphql/mutations';
import { Spinner } from '../../../../shared/Loading';
import { formatError, ifNotTest, setObjectValue } from '../../../../utils/helpers';
import InviteeForm from './InviteeForm';
import SearchInput from '../../../../shared/search/SearchInput';
import GuestSearchCard from './GuestSearchCard';
import { UserChip } from '../../../Tasks/Components/UserChip';
import {  validateGuest } from '../helpers';
import useGuests from '../hooks/useGuests';
import PageWrapper from '../../../../shared/PageWrapper';
import { SnackbarContext } from '../../../../shared/snackbar/Context';
import { formatTimeZone } from '../../../../utils/dateutil'

export default function GuestInviteForm({inviteDetails, onUpdate, close, update, timeZone}) {
  const initialData = { firstName: '', lastName: '', companyName: '', phoneNumber: null, isAdded: false };
  const history = useHistory();
  const [guestData, setGuestData] = useState({
    visitationDate: formatTimeZone(inviteDetails?.visitationDate, timeZone),
    startsAt: formatTimeZone(inviteDetails?.startsAt, timeZone),
    endsAt: formatTimeZone(inviteDetails?.endsAt, timeZone),
    occursOn: inviteDetails?.occursOn,
    visitEndDate: formatTimeZone(inviteDetails?.visitEndDate, timeZone),
    isLoading: inviteDetails?.loading,
    name: inviteDetails?.name
  });
  const [createInvitation] = useMutation(InvitationCreateMutation);
  const { t } = useTranslation(['logbook', 'common', 'discussion', 'search']);
  const [invitees, setInvitees] = useState([]);
  const [newGuest, setNewGuest] = useState(initialData);
  const [searchValue, setSearchValue] = useState('');
  const [guestUsers, setGuestUsers] = useState([]);
  const theme = useTheme();
  const { data, loading, error } = useGuests(searchValue)
  const matchesSmall = useMediaQuery(theme.breakpoints.down('lg'));

  const { showSnackbar, messageType } = useContext(SnackbarContext)

  function handleInputChange(event, index) {
    const { name, value } = event.target;
    if (index == null) {
      setGuestData({
        ...guestData,
        [name]: value
      });
      return;
    }
    setObjectValue(invitees[parseInt(index, 10)], name, value);
    setInvitees([...invitees]);
  }

  function handlePhoneNumber(number, i) {
    invitees[parseInt(i, 10)].phoneNumber = number;
    setInvitees([...invitees]);
  }

  function handleChangeOccurrence(day) {
    if (guestData.occursOn.includes(day)) {
      const leftDays = guestData.occursOn.filter(d => d !== day);
      setGuestData({
        ...guestData,
        occursOn: leftDays
      });
      return;
    }
    setGuestData({
      ...guestData,
      occursOn: [...guestData.occursOn, day]
    });
  }

  function handleInviteGuest() {
    const userIds = guestUsers.map(gst => gst.id);

    const validInfo = validateGuest({
      guests: invitees,
      userIds,
      guestData: {
        visitationDate: guestData.visitationDate,
        startsAt: guestData.startsAt,
        endsAt: guestData.endsAt
      },
      t
    });

    if (!validInfo.valid && ifNotTest()) {
      showSnackbar({ type: messageType.error, message: validInfo.msg });
      return
    }
    setGuestData({ ...guestData, isLoading: true });
    createInvitation({
      variables: {
        userIds,
        guests: invitees,
        visitationDate: guestData.visitationDate,
        startsAt: guestData.startsAt,
        endsAt: guestData.endsAt,
        occursOn: guestData.occursOn,
        visitEndDate: guestData.visitEndDate,
      }
    })
      .then(() => {
        setGuestData({ ...guestData, isLoading: false });
        showSnackbar({ type: messageType.success, message: t('guest.guest_invited') });
        setTimeout(() => history.push('/logbook/guests'), 500);
      })
      .catch(err => {
        setGuestData({ ...guestData, isLoading: false });
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
      });
  }

  function handleAddInvitee(guest) {
    if(!guest.firstName && !guest.companyName) {
      showSnackbar({ type: messageType.error, message: t('guest.guest_name_required') });
      return
    }
    setInvitees([...invitees, newGuest]);
    setNewGuest(initialData);
  }

  function handleRemoveInvitee(index) {
    invitees.splice(index, 1);
    setInvitees([...invitees]);
  }
  function addToGuests(user) {
    setGuestUsers([...guestUsers, user]);
    setSearchValue('');
  }

  function handleDelete(id) {
    const filteredGuests = guestUsers.filter(gst => gst.id !== id);
    setGuestUsers(filteredGuests);
  }

  function handleUpdateGuest(event) {
    event.preventDefault();
    setGuestData({ ...guestData, isLoading: true });
    onUpdate(guestData);
  }

  const noUserFound = searchValue && !loading && !data?.searchGuests.length;
  return (
    <PageWrapper pageTitle={t('logbook.guest_invite')} hideWrapper={update}>
      <Typography variant="subtitle1">
        {update ? t('guest.name_print', { name: guestData?.name }) : t('guest_book.schedule_visit')}
      </Typography>
      <br />
      <GuestTime
        days={guestData.occursOn}
        userData={guestData}
        handleChange={handleInputChange}
        handleChangeOccurrence={handleChangeOccurrence}
        smallDevice={matchesSmall}
        update={!!update}
      />
      <br />
      {!update && (
        <Grid container>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">{t('common:menu.guest_list')}</Typography>
            <br />
            <SearchInput
              title={t('common:misc.users')}
              searchValue={searchValue}
              filterRequired={false}
              handleSearch={event => setSearchValue(event.target.value)}
              handleClear={() => setSearchValue('')}
            />
          </Grid>
        </Grid>
      )}

      {!loading && !error && searchValue && !update &&
        data?.searchGuests?.map(guestInfo => (
          <GuestSearchCard
            key={guestInfo.id}
            guest={guestInfo}
            translate={t}
            handInviteGuest={addToGuests}
          />
        ))}

      {!update && noUserFound && (
        <>
          <br />
          <Typography
            variant="body2"
            gutterBottom
            style={{ marginTop: 16 }}
            data-testid="user_not_found_add_new"
          >
            {t('common:errors.user_not_found_add_new')}
          </Typography>
        </>
      )}

      {!update && noUserFound && (
        <InviteeForm
          guestData={newGuest}
          handlePhoneNumber={number => setNewGuest({ ...newGuest, phoneNumber: number })}
          handleInputChange={({ target }) =>
            setNewGuest({ ...newGuest, [target.name]: target.value })
          }
          handleAction={guest => handleAddInvitee(guest)}
          primary
        />
      )}
      <div>
        {Boolean(guestUsers.length) && (
          <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '20px' }}>
            {t('guest_book.previous_guests')}
          </Typography>
        )}
        {guestUsers.map(user => (
          <UserChip key={user.id} user={user} onDelete={() => handleDelete(user.id)} />
        ))}
        {Boolean(guestUsers?.length) && (
          <>
            <br />
          </>
        )}
      </div>
      {Boolean(invitees?.length) && (
        <>
          <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '20px' }}>
            {t('guest_book.new_guest', { count: 2 })}
          </Typography>
          {invitees.map((invite, index) => (
            <InviteeForm
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              guestData={invite}
              handlePhoneNumber={number => handlePhoneNumber(number, index)}
              handleInputChange={event => handleInputChange(event, index)}
              handleAction={() => handleRemoveInvitee(index)}
              guestCount={index + 1}
            />
          ))}
        </>
      )}

      <br />
      <CenteredContent>
        {guestData.isLoading ? (<Spinner />) : (
          <>
            {update && (
              <Button
                variant="contained"
                color="secondary"
                onClick={close}
                data-testid="close_button"
                sx={{ mr: '20px' }}
              >
                {t('date_picker.cancel')}
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={update ? handleUpdateGuest : handleInviteGuest}
              data-testid={`${update ? 'update' : 'invite'}_button`}
              startIcon={guestData.isLoading && <Spinner />}
              disabled={guestData.isLoading}
            >
              {t(`${update ? 'guest_book.update_guest' : 'guest.invite_guest'}`)}
            </Button>
          </>
        )}
      </CenteredContent>
    </PageWrapper>
  );
}

GuestInviteForm.defaultProps = {
  onUpdate: () => {},
  close: () => {},
  update: false,
  inviteDetails: {
    visitationDate: null,
    startsAt: new Date(),
    endsAt: new Date(),
    occursOn: [],
    visitEndDate: null,
    isLoading: false,
    name: null
  },
  timeZone: undefined
};

GuestInviteForm.propTypes = {
  onUpdate: PropTypes.func,
  inviteDetails: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    startsAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    endsAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    occursOn: PropTypes.arrayOf(PropTypes.string),
    visitationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    visitEndDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    loading: PropTypes.bool,
    name: PropTypes.string
  }),
  close: PropTypes.func,
  update: PropTypes.bool,
  timeZone: PropTypes.string
};