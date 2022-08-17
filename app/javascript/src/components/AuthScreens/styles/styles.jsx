import { StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  getStartedButton: {
    color: '#FFF',
    width: '55%',
    boxShadow: 'none',
    marginTop: 20,
  },
  phoneNumberInput: {
    marginTop: '0.5em',
  },
  emailLoginTextField: {
    marginTop: 14,
  },
  facebookOAuthButton: {
    textTransform: 'none',
    color: '#3b5998',
    display: 'flex',
    justifyContent: 'left',
  },
  googleOAuthButton: {
    textTransform: 'none',
    marginTop: '0.5em',
    display: 'flex',
    justifyContent: 'left',
  },
  socialIcons: {
    marginLeft: '0.5em',
    marginRight: '0.5em',
  },
  "[type='number']": {
    fontSize: 30,
  },
  logo: {
    height: 50,
  },
});

export default styles;
