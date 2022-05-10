import React, { useContext } from 'react';
import { Typography, Box, Container } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { StyleSheet } from 'aphrodite';
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import VerticallyCentered from '../../../../shared/VerticallyCentered';
import CommunityName from '../../../../shared/CommunityName';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import CenteredContent from '../../../../shared/CenteredContent';
import BorderedButton from '../../../../shared/buttons/BorderedButton';
import { languages } from '../../../../utils/constants';
import { defaultColors } from '../../../../themes/nkwashi/theme';

export default function LanguagePage() {
  const authState = useContext(Context);
  const history = useHistory();
  const classes = useStyles();
  const { i18n } = useTranslation();

  const languageSelectHandler = selectedLang => {
    localStorage.setItem('default-language', selectedLang);
    history.push('/logbook/kiosk/index');
    return i18n.changeLanguage(selectedLang);
  }

  return (
    <VerticallyCentered isVerticallyCentered={false}>
      <Container maxWidth="xs">
        <Box component="div" sx={{ marginTop: '130px', marginLeft: '30px' }}>
          <CommunityName authState={authState} logoStyles={styles} />
        </Box>

        <CenteredContent>
          <Typography
            variant="h4"
            textAlign="center"
            data-testid="select_kiosk_language"
            style={{ marginTop: '88px' }}
          >
            Seleccionar Idioma / Select Language
          </Typography>
        </CenteredContent>

        {Object.entries(languages).map(([key, val]) => (
          <div style={{ marginTop: '44px' }} key={key}>
            <CenteredContent>
              <BorderedButton
                title={key}
                data-testid={`${key}_kiosk_lang_btn`}
                onClick={() => languageSelectHandler(val)}
                borderColor={defaultColors.info}
                className={`${val === 'en-US' ? classes.englishButton : classes.spanishButton} ${
                  classes.default
                }`}
              />
            </CenteredContent>
          </div>
        ))}
      </Container>
    </VerticallyCentered>
  );
}

// I used aphrodite here because those are the styles the component is expecting
const styles = StyleSheet.create({
  logo: {
    margin: '-10px 0 0 21%',
    width: '51%',
    height: '25%'
  }
});

const useStyles = makeStyles({
  englishButton: {
    color: `${defaultColors.white} !important`,
    backgroundColor: `${defaultColors.info} !important`
  },
  spanishButton: {
    color: `${defaultColors.info} !important`,
    backgroundColor: `${defaultColors.white} !important`
  },
  default: {
    textTransform: 'capitalize !important'
  }
});