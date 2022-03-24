/* eslint-disable import/prefer-default-export */
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
  text: {
    fontSize: 14,
    paddingLeft: 16,
    textTransform: 'none'
  },
  card: {
    borderRadius: 4,
    margin: 8,
    cursor: 'pointer',
  },
  invitePhoneNumber: {
    marginBottom: 15
  },
  invitePhoneNumberCheck: {
    marginBottom: -10
  },
  inviteForm: {
    marginTop: 5
  },
  guestType: {
    marginTop: 10,
    marginBottom: 8
  },
  guestTypeToggleButtons: {
    marginLeft: 12
  }
});
