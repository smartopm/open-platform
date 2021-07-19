/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { Button, TextField, MenuItem, Container, Grid, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DeleteOutline } from '@material-ui/icons'
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
import { formatError, propAccessor } from '../../../utils/helpers';
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

  const socialLinks = {
    social_link: '',
    category: ''
  };

  const menuItems = {
    menu_link: '',
    menu_name: ''
  };

  const theme = {
    primaryColor: data.themeColors?.primaryColor || '#69ABA4',
    secondaryColor: data.themeColors?.secondaryColor || '#cf5628'
  }

  const banking = {
    bankName: data.bankingDetails?.bankName || '',
    accountName: data.bankingDetails?.accountName || '',
    accountNo: data.bankingDetails?.accountNo || '',
    branch: data.bankingDetails?.branch || '',
    swiftCode: data.bankingDetails?.swiftCode || '',
    sortCode: data.bankingDetails?.sortCode || '',
    address: data.bankingDetails?.address || '',
    city: data.bankingDetails?.city || '',
    country: data.bankingDetails?.country || '',
    taxIdNo: data.bankingDetails?.taxIdNo || '',
  }

  const [communityUpdate] = useMutation(CommunityUpdateMutation);
  const [numberOptions, setNumberOptions] = useState([numbers]);
  const [emailOptions, setEmailOptions] = useState([emails]);
  const [whatsappOptions, setWhatsappOptions] = useState([whatsapps]);
  const [socialLinkOptions, setSocialLinkOptions] = useState([socialLinks]);
  const [menuItemOptions, setMenuItemOptions] = useState([menuItems])
  const [themeColors, setThemeColor] = useState(theme);
  const [bankingDetails, setBankingDetails] = useState(banking);
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
  const [securityManager, setSecurityManager] = useState(data?.securityManager || '');
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

  function handleAddSocialLinkOption() {
    setSocialLinkOptions([...socialLinkOptions, socialLinks]);
  }

  function handleAddMenuItemOption() {
    setMenuItemOptions([...menuItemOptions, menuItems]);
  }

  function updateOptions(index, newValue, options, type) {
    if (type === 'email') {
      handleSetOptions(setEmailOptions, index, newValue, options);
    } else if (type === 'whatsapp') {
      handleSetOptions(setWhatsappOptions, index, newValue, options);
    } else if (type === 'social_link') {
      handleSetOptions(setSocialLinkOptions, index, newValue, options);
    } else if (type === 'menu_link') {
      handleSetOptions(setMenuItemOptions, index, newValue, options);
    }
    else {
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

  function handleMenuItemChange(event, index) {
    updateOptions(index, { [event.target.name]: event.target.value }, menuItemOptions, 'menu_link');
  }

  function handleSocialLinkChange(event, index) {
    updateOptions(
      index,
      { [event.target.name]: event.target.value },
      socialLinkOptions,
      'social_link'
      );
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

  function handleSocialLinkRemoveRow(id) {
    const values = socialLinkOptions;
    if (values.length !== 1) {
      values.splice(id, 1);
    }
    setSocialLinkOptions([...values]);
  }

  function handleMenuItemRemoveRow(id) {
    const values = menuItemOptions;
    if (values.length !== 1) {
      values.splice(id, 1);
    }
    setMenuItemOptions([...values]);
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
        socialLinks: socialLinkOptions,
        menuItems: menuItemOptions,
        imageBlobId: signedBlobId,
        currency,
        locale,
        language,
        tagline,
        logoUrl,
        wpLink,
        securityManager,
        themeColors,
        bankingDetails,
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
    setSocialLinkOptions(data.socialLinks || [socialLinks]);
    setMenuItemOptions(data.menuItems || [menuItems]);
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
      <div className={classes.information} style={{ marginTop: '40px' }}>
        <DynamicContactFields
          options={socialLinkOptions}
          handleChange={handleSocialLinkChange}
          handleRemoveRow={handleSocialLinkRemoveRow}
          data={{ label: t('common:form_fields.social_link'), name: 'social_link' }}
          hasSocialLink
        />
        <div className={classes.addIcon} role="button" onClick={handleAddSocialLinkOption} data-testid='social_link_click'>
          <AddCircleOutlineIcon />
          <div style={{ marginLeft: '10px', color: 'secondary' }}>
            <Typography align="center" variant="caption">
              {t('common:form_fields.add_social_link')}
            </Typography>
          </div>
        </div>
      </div>
      <div className={classes.information} style={{ marginTop: '40px' }}>
        {
          menuItemOptions.map((_menu, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className={{display: 'flex', flexDirection: 'row', margin: '10px 0'}} key={i}>
              <TextField
                id={`${i}-menu-link-input`}
                style={{ width: '300px'}}
                label={t('common:form_fields.link')}
                onChange={(event) => handleMenuItemChange(event, i)}
                value={propAccessor(menuItemOptions[parseInt(i, 10)], 'menu_link')}
                name='menu_link'
                data-testid='menu-link-input'
              />
              <TextField
                id={`${i}-menu-name-input`}
                style={{ width: '200px', marginLeft: '40px' }}
                label={t('common:form_fields.name')}
                onChange={(event) => handleMenuItemChange(event, i)}
                value={propAccessor(menuItemOptions[parseInt(i, 10)], 'menu_name')}
                name='menu_name'
                data-testid='menu-name-input'
              />

              <IconButton
                style={{ marginTop: 13 }}
                onClick={() => handleMenuItemRemoveRow(i)}
                aria-label="remove"
              >
                <DeleteOutline />
              </IconButton>
            </div>
          ))
        }
        <div className={classes.addIcon} role="button" onClick={handleAddMenuItemOption} data-testid='menu_item_click'>
          <AddCircleOutlineIcon />
          <div style={{ marginLeft: '10px', color: 'secondary' }}>
            <Typography align="center" variant="caption">
              {t('common:form_fields.add_menu_item')}
            </Typography>
          </div>
        </div>
      </div>
      <TextField
        label={t('community.set_security_manager')}
        value={securityManager}
        onChange={event => setSecurityManager(event.target.value)}
        name="securityManager"
        margin="normal"
        inputProps={{ "data-testid": "securityManager"}}
        style={{ width: '100%'}}
        required
      />

      <br />
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
        <br />
        <br />
        <Typography variant="h6">Banking Details</Typography>
        <TextField
          label={t('community.account_name')}
          value={bankingDetails.accountName}
          onChange={event => setBankingDetails({ ...bankingDetails, accountName: event.target.value })}
          name="accountName"
          margin="normal"
          inputProps={{ "data-testid": "accountName"}}
          style={{ width: '100%'}}
        />
        <TextField
          label={t('community.account_no')}
          value={bankingDetails.accountNo}
          onChange={event => setBankingDetails({ ...bankingDetails, accountNo: event.target.value })}
          name="accountNo"
          margin="normal"
          inputProps={{ "data-testid": "accountNo"}}
          style={{ width: '100%'}}
        />
        <TextField
          label={t('community.bank')}
          value={bankingDetails.bankName}
          onChange={event => setBankingDetails({ ...bankingDetails, bankName: event.target.value })}
          name="bankName"
          margin="normal"
          inputProps={{ "data-testid": "bankName"}}
          style={{ width: '100%'}}
        />
        <TextField
          label={t('community.branch')}
          value={bankingDetails.branch}
          onChange={event => setBankingDetails({ ...bankingDetails, branch: event.target.value })}
          name="branch"
          margin="normal"
          inputProps={{ "data-testid": "branch"}}
          style={{ width: '100%'}}
        />
        <TextField
          label={t('community.swift_code')}
          value={bankingDetails.swiftCode}
          onChange={event => setBankingDetails({ ...bankingDetails, swiftCode: event.target.value })}
          name="swiftCode"
          margin="normal"
          inputProps={{ "data-testid": "swiftCode"}}
          style={{ width: '100%'}}
        />
        <TextField
          label={t('community.sort_code')}
          value={bankingDetails.sortCode}
          onChange={event => setBankingDetails({ ...bankingDetails, sortCode: event.target.value })}
          name="sortCode"
          margin="normal"
          inputProps={{ "data-testid": "sortCode"}}
          style={{ width: '100%'}}
        />
        <TextField
          label={t('community.address')}
          value={bankingDetails.address}
          onChange={event => setBankingDetails({ ...bankingDetails, address: event.target.value })}
          name="address"
          margin="normal"
          inputProps={{ "data-testid": "address"}}
          style={{ width: '100%'}}
        />
        <TextField
          label={t('community.city')}
          value={bankingDetails.city}
          onChange={event => setBankingDetails({ ...bankingDetails, city: event.target.value })}
          name="city"
          margin="normal"
          inputProps={{ "data-testid": "city"}}
          style={{ width: '100%'}}
        />
        <TextField
          label={t('community.country')}
          value={bankingDetails.country}
          onChange={event => setBankingDetails({ ...bankingDetails, country: event.target.value })}
          name="country"
          margin="normal"
          inputProps={{ "data-testid": "country"}}
          style={{ width: '100%'}}
        />
        <TextField
          label={t('community.tax_id_no')}
          value={bankingDetails.taxIdNo}
          onChange={event => setBankingDetails({ ...bankingDetails, taxIdNo: event.target.value })}
          name="taxIdNo"
          margin="normal"
          inputProps={{ "data-testid": "taxIdNo"}}
          style={{ width: '100%'}}
        />
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
    socialLinks: PropTypes.arrayOf(PropTypes.object),
    menuItems: PropTypes.arrayOf(PropTypes.object),
    imageUrl: PropTypes.string,
    currency: PropTypes.string,
    locale: PropTypes.string,
    language: PropTypes.string,
    tagline: PropTypes.string,
    wpLink: PropTypes.string,
    securityManager: PropTypes.string,
    themeColors: PropTypes.shape({
      primaryColor: PropTypes.string,
      secondaryColor: PropTypes.string,
    }),
    bankingDetails: PropTypes.shape({
      bankName: PropTypes.string,
      accountName: PropTypes.string,
      accountNo: PropTypes.string,
      branch: PropTypes.string,
      swiftCode: PropTypes.string,
      sortCode: PropTypes.string,
      address:PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
      taxIdNo: PropTypes.string,
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
