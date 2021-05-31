/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { Button, TextField, MenuItem, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { useMutation, useApolloClient } from 'react-apollo';
import { CommunityUpdateMutation } from '../graphql/community_mutations';
import DynamicContactFields from './DynamicContactFields';
import MessageAlert from '../../../components/MessageAlert';
import { useFileUpload } from '../../../graphql/useFileUpload';
import ImageCropper from './ImageCropper';
import { currencies, locales, languages } from '../../../utils/constants';
import ImageAuth from '../../../shared/ImageAuth';
import { formatError } from '../../../utils/helpers';
import { Spinner } from '../../../shared/Loading';
import ColorPicker from './ColorPicker';
import { validateThemeColor } from '../helpers';

export default function CommunitySettings({ data, token, refetch }) {
  const numbers = {
    phone_number: '',
    category: ''
  };
  const emails = {
    email: '',
    category: ''
  };
  const whatsapps = {
    whatsapp: '',
    category: ''
  };

  const theme = {
    primaryColor: data.themeColors?.primaryColor || '#69ABA4',
    secondaryColor: data.themeColors?.secondaryColor || '#cf5628'
  }

  const [communityUpdate] = useMutation(CommunityUpdateMutation);
  const [numberOptions, setNumberOptions] = useState([numbers]);
  const [emailOptions, setEmailOptions] = useState([emails]);
  const [whatsappOptions, setWhatsappOptions] = useState([whatsapps]);
  const [themeColors, setThemeColor] = useState(theme);
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [alertOpen, setAlertOpen] = useState(false);
  const [mutationLoading, setCallMutation] = useState(false);
  const [blob, setBlob] = useState(null);
  const [inputImg, setInputImg] = useState('');
  const [fileName, setFileName] = useState('');
  const [currency, setCurrency] = useState('');
  const [tagline, setTagline] = useState(data?.tagline || '');
  const [logoUrl, setLogoUrl] = useState(data?.logoUrl || '');
  const [wpLink, setWpLink] = useState(data?.wpLink || '');
  const [locale, setLocale] = useState('en-ZM');
  const [language, setLanguage] = useState('en-US');
  const [showCropper, setShowCropper] = useState(false);
  const { t } = useTranslation(['community', 'common'])
  const { onChange, signedBlobId } = useFileUpload({
    client: useApolloClient()
  });

  const classes = useStyles();

  function handleAddNumberOption() {
    setNumberOptions([...numberOptions, numbers]);
  }

  function getBlob(blobb) {
    setBlob(blobb);
  }

  function handleAddEmailOption() {
    setEmailOptions([...emailOptions, emails]);
  }

  function handleAddWhatsappOption() {
    setWhatsappOptions([...whatsappOptions, whatsapps]);
  }

  function updateOptions(index, newValue, options, type) {
    if (type === 'email') {
      handleSetOptions(setEmailOptions, index, newValue, options);
    } else if (type === 'whatsapp') {
      handleSetOptions(setWhatsappOptions, index, newValue, options);
    } else {
      handleSetOptions(setNumberOptions, index, newValue, options);
    }
  }

  function handleSetOptions(handler, index, newValue, options) {
    handler([
      ...options.slice(0, index),
      { ...options[parseInt(index, 10)], ...newValue },
      ...options.slice(index + 1)
    ]);
  }

  function handleEmailChange(event, index) {
    updateOptions(index, { [event.target.name]: event.target.value }, emailOptions, 'email');
  }

  function handleWhatsappChange(event, index) {
    updateOptions(index, { [event.target.name]: event.target.value }, whatsappOptions, 'whatsapp');
  }

  function handleNumberRemove(id) {
    const values = numberOptions;
    if (values.length !== 1) {
      values.splice(id, 1);
    }
    setNumberOptions([...values]);
  }

  function handleEmailRemoveRow(id) {
    const values = emailOptions;
    if (values.length !== 1) {
      values.splice(id, 1);
    }
    setEmailOptions([...values]);
  }

  function handleWhatsappRemoveRow(id) {
    const values = whatsappOptions;
    if (values.length !== 1) {
      values.splice(id, 1);
    }
    setWhatsappOptions([...values]);
  }

  function onInputChange(file) {
    setFileName(file.name);
    // convert image file to base64 string
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        setInputImg(reader.result);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function handleNumberChange(event, index) {
    updateOptions(
      index,
      { [event.target.name]: event.target.value },
      numberOptions,
      'phone_number'
    );
  }

  function uploadLogo(img) {
    onChange(img);
    setShowCropper(false);
    setMessage({ isError: false, detail: t('community.logo_updated') });
    setAlertOpen(true);
  }

  function selectLogoOnchange(img) {
    onInputChange(img);
    setShowCropper(true);
  }

  function setLanguageInLocalStorage(selectedLanguage) {
    localStorage.setItem('default-language', selectedLanguage);
  }

  function updateCommunity() {
    if(!validateThemeColor(themeColors)){
      setAlertOpen(true);
      setMessage({
        isError: true,
        detail: t('common:errors.invalid_color_code') 
      });
      return
    }
    setCallMutation(true);
    communityUpdate({
      variables: {
        supportNumber: numberOptions,
        supportEmail: emailOptions,
        supportWhatsapp: whatsappOptions,
        imageBlobId: signedBlobId,
        currency,
        locale,
        language,
        tagline,
        logoUrl,
        wpLink,
        themeColors
      },
    })
      .then(() => {
        setMessage({
          isError: false,
          detail: t('community.community_updated') 
        });
        setLanguageInLocalStorage(language)
        setAlertOpen(true);
        setCallMutation(false);
        // only reload if the primary color has changed
        if(themeColors.primaryColor !== data.themeColors?.primaryColor) {
          window.location.reload()
        }
        refetch()
      })
      .catch(error => {
        setMessage({ isError: true, detail: formatError(error.message) });
        setAlertOpen(true);
        setCallMutation(false);
      });
  }
  useEffect(() => {
    setEmailOptions(data.supportEmail || [emails]);
    setNumberOptions(data.supportNumber || [numbers]);
    setWhatsappOptions(data.supportWhatsapp || [whatsapps]);
    setCurrency(data.currency);
    setLocale(data.locale);
    setLanguage(data.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Container>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={alertOpen}
        handleClose={() => setAlertOpen(false)}
      />
      <Typography variant="h6">{t('community.community_logo')}</Typography>
      <Typography variant="caption">{t('community.change_community_logo')}</Typography>
      <div className={classes.avatar}>
        <ImageAuth
          imageLink={data.imageUrl}
          token={token}
          className="img-responsive img-thumbnail"
          style={{ height: '70px', width: '70px' }}
        />
        <div className={classes.upload}>
          <Typography variant="caption" style={{ fontWeight: 'bold', marginLeft: '10px' }}>
            {t('community.upload_logo')}
          </Typography>
          <div>
            <Button variant="contained" component="label">
              {t('common:misc.choose_file')}
              <input
                type="file"
                hidden
                onChange={event => selectLogoOnchange(event.target.files[0])}
                accept="image/*"
              />
            </Button>
          </div>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        {showCropper && inputImg && (
          <ImageCropper getBlob={getBlob} inputImg={inputImg} fileName={fileName} />
        )}
      </div>
      {showCropper && blob && (
        <Button variant="contained" style={{ margin: '10px' }} onClick={() => uploadLogo(blob)}>
          Upload
        </Button>
      )}
      <div className={classes.information} style={{ marginTop: '40px' }}>
        <Typography variant="h6">{t('community.support_contact')}</Typography>
        <Typography variant="caption">{t('community.make_changes_support_contact')}</Typography>

        <DynamicContactFields
          options={numberOptions}
          handleChange={handleNumberChange}
          handleRemoveRow={handleNumberRemove}
          data={{ label: t('common:form_fields.phone_number'), name: 'phone_number' }}
        />
        <div
          className={classes.addIcon}
          role="button"
          onClick={handleAddNumberOption}
          data-testid="add_number"
        >
          <AddCircleOutlineIcon />
          <div style={{ marginLeft: '10px', color: 'secondary' }}>
            <Typography align="center" variant="caption">
              {t('common:form_fields.add_phone_number')}
            </Typography>
          </div>
        </div>
      </div>
      <div className={classes.information} style={{ marginTop: '40px' }}>
        <DynamicContactFields
          options={whatsappOptions}
          handleChange={handleWhatsappChange}
          handleRemoveRow={handleWhatsappRemoveRow}
          data={{ label: 'WhatsApp', name: 'whatsapp' }}
        />
        <div className={classes.addIcon} role="button" onClick={handleAddWhatsappOption} data-testid='whatsapp_click'>
          <AddCircleOutlineIcon />
          <div style={{ marginLeft: '10px', color: 'secondary' }}>
            <Typography align="center" variant="caption">
              {t('common:form_fields.add_whatsapp_number')}
            </Typography>
          </div>
        </div>
      </div>
      <div className={classes.information} style={{ marginTop: '40px' }}>
        <DynamicContactFields
          options={emailOptions}
          handleChange={handleEmailChange}
          handleRemoveRow={handleEmailRemoveRow}
          data={{ label: t('common:form_fields.email'), name: 'email' }}
        />
        <div className={classes.addIcon} role="button" onClick={handleAddEmailOption} data-testid='email_click'>
          <AddCircleOutlineIcon />
          <div style={{ marginLeft: '10px', color: 'secondary' }}>
            <Typography align="center" variant="caption">
              {t('common:form_fields.add_email_address')}
            </Typography>
          </div>
        </div>
      </div>

      <br />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          Primary Color
        </Grid>
        <Grid item xs={12} sm={9}>
          <ColorPicker color={themeColors.primaryColor} handleColor={color => setThemeColor({ ...themeColors, primaryColor: color })} />
        </Grid>
        <Grid item xs={12} sm={3}>
          Secondary Color
        </Grid>
        <Grid item xs={12} sm={9}>
          <ColorPicker color={themeColors.secondaryColor} handleColor={color => setThemeColor({ ...themeColors, secondaryColor: color })} />
        </Grid>
      </Grid>

      <div className={classes.information} style={{ marginTop: '40px' }}>
        <TextField
          label={t('community.community_tagline')}
          value={tagline}
          onChange={event => setTagline(event.target.value)}
          name="tagline"
          margin="normal"
          inputProps={{ "data-testid": "tagline"}}
        />
        <TextField
          label={t('community.community_logo_url')}
          value={logoUrl}
          onChange={event => setLogoUrl(event.target.value)}
          name="tagline"
          margin="normal"
          inputProps={{ "data-testid": "logo_url"}}
        />
        <TextField
          label={t('community.wordpress_url')}
          value={wpLink}
          onChange={event => setWpLink(event.target.value)}
          name="wp_link"
          margin="normal"
          inputProps={{ "data-testid": "wp_link"}}
        />

      </div>

      <div style={{ marginTop: '40px' }}>
        <Typography variant="h6">{t('community.community_transactions')}</Typography>
        <TextField
          style={{ width: '200px' }}
          select
          label={t('community.set_currency')}
          value={currency}
          onChange={event => setCurrency(event.target.value)}
          name="currency"
          margin="normal"
          inputProps={{ "data-testid": "currency"}}
        >
          {Object.entries(currencies).map(([key, val]) => (
            <MenuItem key={key} value={key}>
              {val}
            </MenuItem>
          ))}
        </TextField>
        <br />
        <TextField
          style={{ width: '200px' }}
          select
          label={t('community.set_locale')}
          value={locale}
          onChange={event => setLocale(event.target.value)}
          name="locale"
          margin="normal"
          inputProps={{ "data-testid": "locale"}}
        >
          {locales.map((loc) => (
            <MenuItem key={loc} value={loc}>
              {loc}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div style={{ marginTop: '40px' }}>
        <Typography variant="h6">{t('community.language_settings')}</Typography>
        <TextField
          style={{ width: '200px' }}
          select
          label={t('community.set_language')}
          value={language || 'en-US'}
          onChange={event => setLanguage(event.target.value)}
          name="language"
          margin="normal"
          inputProps={{ "data-testid": "language"}}
        >
          {
            Object.entries(languages).map(([key, val]) => (
              <MenuItem key={val} value={val}>
                {key}
              </MenuItem>
            ))
          }
        </TextField>
      </div>

      <div className={classes.button}>
        <Button
          disableElevation
          variant="outlined"
          color="primary"
          disabled={mutationLoading}
          onClick={updateCommunity}
          data-testid="update_community"
        >
          {
            mutationLoading ? <Spinner /> : t('community.update_community')
          }
        </Button>
      </div>
    </Container>
  );
}

CommunitySettings.propTypes = {
  data: PropTypes.shape({
    logoUrl: PropTypes.string,
    supportNumber: PropTypes.arrayOf(PropTypes.object),
    supportEmail: PropTypes.arrayOf(PropTypes.object),
    supportWhatsapp: PropTypes.arrayOf(PropTypes.object),
    imageUrl: PropTypes.string,
    currency: PropTypes.string,
    locale: PropTypes.string,
    language: PropTypes.string,
    tagline: PropTypes.string,
    wpLink: PropTypes.string,
    themeColors: PropTypes.shape({
      primaryColor: PropTypes.string,
      secondaryColor: PropTypes.string,
    }),
  }).isRequired,
  token: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
};

const useStyles = makeStyles(theme => ({
  avatar: {
    display: 'flex',
    flexDirection: 'row',
    margin: '20px 0'
  },
  upload: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 10px'
  },
  information: {
    display: 'flex',
    flexDirection: 'column'
  },
  textField: {
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0'
  },
  addIcon: {
    color: theme.palette.primary.main,
    display: 'flex',
    marginTop: '20px',
    cursor: 'pointer'
  },
  button: {
    marginTop: '15px'
  }
}));
