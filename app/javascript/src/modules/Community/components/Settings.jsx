/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable complexity */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Button, TextField, MenuItem, Container, Grid, IconButton, Checkbox } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DeleteOutline } from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { useMutation, useApolloClient, useQuery } from 'react-apollo';
import { CommunityUpdateMutation } from '../graphql/community_mutations';
import DynamicContactFields from './DynamicContactFields';
import MessageAlert from '../../../components/MessageAlert';
import useFileUpload from '../../../graphql/useFileUpload';
import {
  currencies,
  locales,
  languages,
  CommunityFeaturesWhiteList
} from '../../../utils/constants';
import ImageAuth from '../../../shared/ImageAuth';
import { formatError, objectAccessor } from '../../../utils/helpers';
import { Spinner } from '../../../shared/Loading';
import ColorPicker from './ColorPicker';
import { validateThemeColor } from '../helpers';
import { AdminUsersQuery } from '../../Users/graphql/user_query';
import MultiSelect from '../../../shared/MultiSelect';
import { EmailTemplatesQuery } from '../../Emails/graphql/email_queries';

export default function CommunitySettings({ data, refetch }) {
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

  const leadMonthlyTargets = {
    division: '',
    target: ''
  };

  const menuItems = {
    menu_link: '',
    menu_name: '',
    display_on: ['Dashboard'],
    roles: []
  };

  const theme = {
    primaryColor: data.themeColors?.primaryColor || '#69ABA4',
    secondaryColor: data.themeColors?.secondaryColor || '#cf5628'
  };

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
    taxIdNo: data.bankingDetails?.taxIdNo || ''
  };

  const features = data?.features || {};

  const quickLinksDisplayOptions = ['Dashboard', 'Menu'];
  const roleOptions = ['admin', 'client', 'resident', 'developer', 'consultant', 'marketing_admin'];

  const [communityUpdate] = useMutation(CommunityUpdateMutation);
  const [numberOptions, setNumberOptions] = useState([numbers]);
  const [emailOptions, setEmailOptions] = useState([emails]);
  const [whatsappOptions, setWhatsappOptions] = useState([whatsapps]);
  const [socialLinkOptions, setSocialLinkOptions] = useState([socialLinks]);
  const [menuItemOptions, setMenuItemOptions] = useState([menuItems]);
  const [divisionTargetsOptions, setDivisionTargetsOptions] = useState([leadMonthlyTargets]);
  const [behindTemplate, setBehindTemplate] = useState(
    data?.templates?.payment_reminder_template_behind || ''
  );
  const [upcomingTemplate, setUpcomingTemplate] = useState(
    data?.templates?.payment_reminder_template_upcoming || ''
  );
  const [templateOptions, setTemplateOptions] = useState(data?.templates || {});
  const [themeColors, setThemeColor] = useState(theme);
  const [bankingDetails, setBankingDetails] = useState(banking);
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [alertOpen, setAlertOpen] = useState(false);
  const [mutationLoading, setCallMutation] = useState(false);
  const [currency, setCurrency] = useState('');
  const [tagline, setTagline] = useState(data?.tagline || '');
  const [logoUrl, setLogoUrl] = useState(data?.logoUrl || '');
  const [wpLink, setWpLink] = useState(data?.wpLink || '');
  const [analyticsId, setAnalyticsId] = useState(data?.gaId || '');
  const [securityManager, setSecurityManager] = useState(data?.securityManager || '');
  const [subAdministratorId, setSubAdministrator] = useState(data?.subAdministrator?.id || '');
  const [locale, setLocale] = useState('en-ZM');
  const [language, setLanguage] = useState('en-US');
  const [hasQuickLinksSettingChanged, setHasQuickLinksSettingChanged] = useState(false);
  const [divisionTargetChanged, setDivisionTargetChanged] = useState(false);
  const [smsPhoneNumbers, setSMSPhoneNumbers] = useState(data?.smsPhoneNumbers?.join(',') || '');
  const [emergencyCallNumber, setEmergencyCallNumber] = useState(data?.emergencyCallNumber || '');
  const [communityFeatures, setCommunityFeatures] = useState(features);
  const [logoDimension, setLogoDimension] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const { t } = useTranslation(['community', 'common']);
  const { onChange, signedBlobId } = useFileUpload({
    client: useApolloClient()
  });

  const { data: adminUsersData } = useQuery(AdminUsersQuery, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  const { data: emailTemplatesData } = useQuery(EmailTemplatesQuery, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const classes = useStyles({ heightValue: logoDimension[1], widthValue: logoDimension[0] });

  function handleAddNumberOption() {
    setNumberOptions([...numberOptions, numbers]);
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

  function handleAddDivisionTargetsOptions() {
    setDivisionTargetsOptions([...divisionTargetsOptions, leadMonthlyTargets]);
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
    } else if (type === 'division') {
      handleSetOptions(setDivisionTargetsOptions, index, newValue, options);
    } else {
      handleSetOptions(setNumberOptions, index, newValue, options);
    }
  }

  function handleSetOptions(handler, index, newValue, options) {
    handler([
      ...options.slice(0, index),
      { ...objectAccessor(options, index), ...newValue },
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
    setHasQuickLinksSettingChanged(true);
    updateOptions(index, { [event.target.name]: event.target.value }, menuItemOptions, 'menu_link');
  }

  function handleDivisionTargetChange(event, index) {
    setDivisionTargetChanged(true);
    updateOptions(
      index,
      { [event.target.name]: event.target.value },
      divisionTargetsOptions,
      'division'
    );
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
    if (values.length === 1) {
      setMenuItemOptions([menuItems]);
      return;
    }

    values.splice(id, 1);
    setMenuItemOptions([...values]);
  }

  function handleDivisionTargetRemoveRow(id) {
    const values = divisionTargetsOptions;
    if (values.length === 1) {
      setDivisionTargetsOptions([leadMonthlyTargets]);
      return;
    }

    values.splice(id, 1);
    setDivisionTargetsOptions([...values]);
  }

  function handleModuleFeatures(e, moduleName, feature) {
    const subFeatures = objectAccessor(communityFeatures, moduleName)?.features;
    if (!subFeatures) return;

    if (e.target.checked) {
      if (!subFeatures.includes(objectAccessor(CommunityFeaturesWhiteList, feature))) {
        objectAccessor(communityFeatures, String(moduleName)).features.push(
          objectAccessor(CommunityFeaturesWhiteList, feature)
        );
        setCommunityFeatures({ ...communityFeatures });
      }
    } else if (subFeatures.includes(objectAccessor(CommunityFeaturesWhiteList, feature))) {
      const updatedSubFeatures = objectAccessor(communityFeatures, moduleName).features.filter(
        v => v !== objectAccessor(CommunityFeaturesWhiteList, feature)
      );
      objectAccessor(communityFeatures, String(moduleName)).features = updatedSubFeatures;
      setCommunityFeatures({ ...communityFeatures });
    }
  }

  function onInputChange(file) {
    // convert image file to base64 string
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        const image = new Image();
        image.src = reader.result;
        image.addEventListener(
          'load',
          // eslint-disable-next-line consistent-return
          () => {
            if (image.height > 160 || image.width > 600) {
              setMessage({ isError: true, detail: t('community.upload_error') });
              setAlertOpen(true);
              return false;
            }
            setLogoDimension([image.width, image.height]);
            setImageSrc(reader.result);
            uploadLogo(file);
          },
          false
        );
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
    onChange(img, false);
    setMessage({ isError: false, detail: t('community.logo_updated') });
    setAlertOpen(true);
  }

  function setLanguageInLocalStorage(selectedLanguage) {
    localStorage.setItem('default-language', selectedLanguage);
  }

  function handleTemplates(event) {
    if (event.target.name === 'behindTemplate') {
      setBehindTemplate(event.target.value);
      setTemplateOptions({
        ...templateOptions,
        payment_reminder_template_behind: event.target.value
      });
    } else {
      setUpcomingTemplate(event.target.value);
      setTemplateOptions({
        ...templateOptions,
        payment_reminder_template_upcoming: event.target.value
      });
    }
  }

  function updateCommunity() {
    if (!validateThemeColor(themeColors)) {
      setAlertOpen(true);
      setMessage({
        isError: true,
        detail: t('common:errors.invalid_color_code')
      });
      return;
    }
    setCallMutation(true);
    communityUpdate({
      variables: {
        supportNumber: numberOptions,
        supportEmail: emailOptions,
        supportWhatsapp: whatsappOptions,
        socialLinks: socialLinkOptions,
        menuItems: menuItemOptions,
        leadMonthlyTargets: divisionTargetsOptions,
        imageBlobId: signedBlobId,
        // eslint-disable-next-line max-lines
        templates: templateOptions,
        gaId: analyticsId,
        currency,
        locale,
        language,
        tagline,
        logoUrl,
        wpLink,
        securityManager,
        subAdministratorId,
        themeColors,
        bankingDetails,
        smsPhoneNumbers: smsPhoneNumbers.split(/[ ,]+/).filter(Boolean),
        emergencyCallNumber,
        features: communityFeatures
      }
    })
      .then(() => {
        setMessage({
          isError: false,
          detail: t('community.community_updated')
        });
        setLanguageInLocalStorage(language);
        setAlertOpen(true);
        setCallMutation(false);
        // reload if the primary color, quick links or division targets have changed
        if (
          themeColors.primaryColor !== data.themeColors?.primaryColor ||
          hasQuickLinksSettingChanged ||
          divisionTargetChanged
        ) {
          window.location.reload();
        }
        refetch();
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
    setDivisionTargetsOptions(data.leadMonthlyTargets || [leadMonthlyTargets]);
    setTemplateOptions(data.templates || templateOptions);
    setCurrency(data.currency);
    setLocale(data.locale);
    setLanguage(data.language);
    updateLogoDimension(data.imageUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function updateLogoDimension(url) {
    const img = new Image();
    img.addEventListener('load', function() {
      setLogoDimension([img.width, img.height]);
    });
    img.src = url;
  }

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
        <>
          {imageSrc ? (
            <img src={imageSrc} className={classes.preview} alt="community logo" />
          ) : (
            <ImageAuth imageLink={data.imageUrl} className={`${classes.preview} img-responsive`} />
          )}
        </>
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
                onChange={event => onInputChange(event.target.files[0])}
                accept="image/*"
                data-testid="logo-input"
              />
            </Button>
          </div>
        </div>
      </div>
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
        <div
          className={classes.addIcon}
          role="button"
          onClick={handleAddWhatsappOption}
          data-testid="whatsapp_click"
        >
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
        <div
          className={classes.addIcon}
          role="button"
          onClick={handleAddEmailOption}
          data-testid="email_click"
        >
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
        <div
          className={classes.addIcon}
          role="button"
          onClick={handleAddSocialLinkOption}
          data-testid="social_link_click"
        >
          <AddCircleOutlineIcon />
          <div style={{ marginLeft: '10px', color: 'secondary' }}>
            <Typography align="center" variant="caption">
              {t('common:form_fields.add_social_link')}
            </Typography>
          </div>
        </div>
      </div>
      <div className={classes.information} style={{ marginTop: '40px' }}>
        {menuItemOptions.map((_menu, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div style={{ display: 'flex', flexDirection: 'row', margin: '10px 0' }} key={i}>
            <div>
              <div style={{ display: 'flex', flexDirection: 'row', margin: '10px 0' }}>
                <TextField
                  id={`${i}-menu-link-input`}
                  style={{ width: '300px' }}
                  label={t('common:form_fields.link')}
                  onChange={event => handleMenuItemChange(event, i)}
                  value={objectAccessor(objectAccessor(menuItemOptions, i), 'menu_link')}
                  name="menu_link"
                  data-testid="menu-link-input"
                />
                <TextField
                  id={`${i}-menu-name-input`}
                  style={{ width: '200px' }}
                  className={classes.menuItemRight}
                  label={t('common:form_fields.name')}
                  onChange={event => handleMenuItemChange(event, i)}
                  value={objectAccessor(objectAccessor(menuItemOptions, i), 'menu_name')}
                  name="menu_name"
                  data-testid="menu-name-input"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', margin: '20px 0 10px 0' }}>
                <MultiSelect
                  labelName={t('common:form_placeholders.select_roles')}
                  fieldName="roles"
                  options={roleOptions}
                  type="chip"
                  handleOnChange={event => handleMenuItemChange(event, i)}
                  selectedOptions={
                    objectAccessor(objectAccessor(menuItemOptions, i), 'roles') || []
                  }
                />
                <span className={classes.menuItemRight}>
                  <MultiSelect
                    labelName={t('common:form_placeholders.display_on')}
                    fieldName="display_on"
                    options={quickLinksDisplayOptions}
                    handleOnChange={event => handleMenuItemChange(event, i)}
                    selectedOptions={
                      objectAccessor(objectAccessor(menuItemOptions, i), 'display_on') || []
                    }
                  />
                </span>
              </div>
            </div>
            <div style={{ paddingTop: '20px' }}>
              <IconButton
                style={{ marginTop: 13 }}
                onClick={() => handleMenuItemRemoveRow(i)}
                aria-label="remove"
                size="large"
              >
                <DeleteOutline />
              </IconButton>
            </div>
          </div>
        ))}
        <div
          className={classes.addIcon}
          role="button"
          onClick={handleAddMenuItemOption}
          data-testid="menu_item_click"
        >
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
        inputProps={{ 'data-testid': 'securityManager' }}
        style={{ width: '100%' }}
        required
      />
      {!!adminUsersData?.adminUsers?.length && (
        <TextField
          style={{ width: '300px' }}
          label={t('community.set_sub_administrator')}
          value={subAdministratorId}
          onChange={event => setSubAdministrator(event.target.value)}
          name="subAdministrator"
          margin="normal"
          inputProps={{ 'data-testid': 'subAdministrator' }}
          select
        >
          {adminUsersData?.adminUsers?.map(admin => (
            <MenuItem key={admin.id} value={admin.id}>
              {admin.name}
            </MenuItem>
          ))}
        </TextField>
      )}
      <br />
      <br />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          Primary Color
        </Grid>
        <Grid item xs={12} sm={9}>
          <ColorPicker
            color={themeColors.primaryColor}
            handleColor={color => setThemeColor({ ...themeColors, primaryColor: color })}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          Secondary Color
        </Grid>
        <Grid item xs={12} sm={9}>
          <ColorPicker
            color={themeColors.secondaryColor}
            handleColor={color => setThemeColor({ ...themeColors, secondaryColor: color })}
          />
        </Grid>
      </Grid>

      <div className={classes.information} style={{ marginTop: '40px' }}>
        <TextField
          label={t('community.community_tagline')}
          value={tagline}
          onChange={event => setTagline(event.target.value)}
          name="tagline"
          margin="normal"
          inputProps={{ 'data-testid': 'tagline' }}
        />
        <TextField
          label={t('community.community_logo_url')}
          value={logoUrl}
          onChange={event => setLogoUrl(event.target.value)}
          name="tagline"
          margin="normal"
          inputProps={{ 'data-testid': 'logo_url' }}
        />
        <TextField
          label={t('community.wordpress_url')}
          value={wpLink}
          onChange={event => setWpLink(event.target.value)}
          name="wp_link"
          margin="normal"
          inputProps={{ 'data-testid': 'wp_link' }}
        />
        <TextField
          label={t('community.google_analytics_id')}
          value={analyticsId}
          onChange={event => setAnalyticsId(event.target.value)}
          name="google_analytics_id"
          margin="normal"
          inputProps={{ 'data-testid': 'google_analytics_id' }}
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
          inputProps={{ 'data-testid': 'currency' }}
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
          inputProps={{ 'data-testid': 'locale' }}
        >
          {locales.map(loc => (
            <MenuItem key={loc} value={loc}>
              {loc}
            </MenuItem>
          ))}
        </TextField>
        <br />
        <br />
        <Typography variant="h6">{t('community.banking_details')}</Typography>
        <TextField
          label={t('community.account_name')}
          value={bankingDetails.accountName}
          onChange={event =>
            setBankingDetails({ ...bankingDetails, accountName: event.target.value })
          }
          name="accountName"
          margin="normal"
          inputProps={{ 'data-testid': 'accountName' }}
          style={{ width: '100%' }}
        />
        <TextField
          label={t('community.account_no')}
          value={bankingDetails.accountNo}
          onChange={event =>
            setBankingDetails({ ...bankingDetails, accountNo: event.target.value })
          }
          name="accountNo"
          margin="normal"
          inputProps={{ 'data-testid': 'accountNo' }}
          style={{ width: '100%' }}
        />
        <TextField
          label={t('community.bank')}
          value={bankingDetails.bankName}
          onChange={event => setBankingDetails({ ...bankingDetails, bankName: event.target.value })}
          name="bankName"
          margin="normal"
          inputProps={{ 'data-testid': 'bankName' }}
          style={{ width: '100%' }}
        />
        <TextField
          label={t('community.branch')}
          value={bankingDetails.branch}
          onChange={event => setBankingDetails({ ...bankingDetails, branch: event.target.value })}
          name="branch"
          margin="normal"
          inputProps={{ 'data-testid': 'branch' }}
          style={{ width: '100%' }}
        />
        <TextField
          label={t('community.swift_code')}
          value={bankingDetails.swiftCode}
          onChange={event =>
            setBankingDetails({ ...bankingDetails, swiftCode: event.target.value })
          }
          name="swiftCode"
          margin="normal"
          inputProps={{ 'data-testid': 'swiftCode' }}
          style={{ width: '100%' }}
        />
        <TextField
          label={t('community.sort_code')}
          value={bankingDetails.sortCode}
          onChange={event => setBankingDetails({ ...bankingDetails, sortCode: event.target.value })}
          name="sortCode"
          margin="normal"
          inputProps={{ 'data-testid': 'sortCode' }}
          style={{ width: '100%' }}
        />
        <TextField
          label={t('community.address')}
          value={bankingDetails.address}
          onChange={event => setBankingDetails({ ...bankingDetails, address: event.target.value })}
          name="address"
          margin="normal"
          inputProps={{ 'data-testid': 'address' }}
          style={{ width: '100%' }}
        />
        <TextField
          label={t('community.city')}
          value={bankingDetails.city}
          onChange={event => setBankingDetails({ ...bankingDetails, city: event.target.value })}
          name="city"
          margin="normal"
          inputProps={{ 'data-testid': 'city' }}
          style={{ width: '100%' }}
        />
        <TextField
          label={t('community.country')}
          value={bankingDetails.country}
          onChange={event => setBankingDetails({ ...bankingDetails, country: event.target.value })}
          name="country"
          margin="normal"
          inputProps={{ 'data-testid': 'country' }}
          style={{ width: '100%' }}
        />
        <TextField
          label={t('community.tax_id_no')}
          value={bankingDetails.taxIdNo}
          onChange={event => setBankingDetails({ ...bankingDetails, taxIdNo: event.target.value })}
          name="taxIdNo"
          margin="normal"
          inputProps={{ 'data-testid': 'taxIdNo' }}
          style={{ width: '100%' }}
        />
      </div>

      <br />
      <Typography variant="h6">{t('community.gate_access_settings_header')}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3} className={classes.checkBox}>
          <Typography>{t('community.hide_deny_gate_access_button')}</Typography>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Checkbox
            checked={objectAccessor(communityFeatures, String('LogBook'))?.features.includes(
              CommunityFeaturesWhiteList.denyGateAccessButton
            )}
            onChange={e => handleModuleFeatures(e, 'LogBook', 'denyGateAccessButton')}
            name="disable-deny-gate-access"
            data-testid="disable_deny_gate_access"
            color="primary"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3} className={classes.checkBox}>
          <Typography>{t('community.guest_verification')}</Typography>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Checkbox
            checked={objectAccessor(communityFeatures, String('LogBook'))?.features.includes(
              CommunityFeaturesWhiteList.guestVerification
            )}
            onChange={e => handleModuleFeatures(e, 'LogBook', 'guestVerification')}
            name="disable-deny-gate-access"
            data-testid="guest_verification"
            color="primary"
          />
        </Grid>
      </Grid>
      <br />

      <Typography variant="h6">{t('community.tasks_settings')}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3} className={classes.checkBox}>
          <Typography>{t('community.enable_auomated_reminders')}</Typography>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Checkbox
            checked={objectAccessor(communityFeatures, String('Tasks'))?.features.includes(
              CommunityFeaturesWhiteList.automatedTaskReminders
            )}
            onChange={e => handleModuleFeatures(e, 'Tasks', 'automatedTaskReminders')}
            name="enable_automated_task_reminders"
            data-testid="enable_automated_task_reminders"
            color="primary"
          />
        </Grid>
      </Grid>
      <br />

      <Typography variant="h6">{t('community.sms_phone_numbers_header')}</Typography>

      <TextField
        label={t('community.sms_phone_numbers')}
        value={smsPhoneNumbers}
        onChange={event => setSMSPhoneNumbers(event.target.value)}
        name="smsPhoneNumber"
        margin="normal"
        inputProps={{ 'data-testid': 'smsPhoneNumber' }}
        style={{ width: '100%' }}
      />
      <br />

      <TextField
        label={t('community.emergency_call_number')}
        value={emergencyCallNumber}
        onChange={event => setEmergencyCallNumber(event.target.value)}
        name="emergencyCallNumber"
        margin="normal"
        inputProps={{ 'data-testid': 'emergencyCallNumber' }}
        style={{ width: '100%' }}
      />
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
          inputProps={{ 'data-testid': 'language' }}
        >
          {Object.entries(languages).map(([key, val]) => (
            <MenuItem key={val} value={val}>
              {key}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div style={{ marginTop: '40px' }}>
        <Typography variant="h6">{t('community.notification_templates')}</Typography>
        <div style={{ display: 'flex', flexDirection: 'row', margin: '10px 0' }}>
          <TextField
            margin="normal"
            id="behind"
            label={t('community.status')}
            aria-label="behind"
            value={t('community.behind')}
            name="duration"
            style={{ width: '200px' }}
            InputProps={{
              'data-testid': 'plan_status_behind'
            }}
            disabled
          />
          {!!emailTemplatesData?.emailTemplates?.length && (
            <TextField
              margin="normal"
              id="payment-reminder-behind"
              aria-label="payment reminder behind"
              label={t('community.select_template')}
              value={behindTemplate}
              onChange={handleTemplates}
              name="behindTemplate"
              inputProps={{
                'data-testid': 'payment_reminder_template_behind'
              }}
              style={{ width: '200px', marginLeft: '40px' }}
              select
            >
              {emailTemplatesData?.emailTemplates?.map(template => (
                <MenuItem key={template.id} value={template?.id}>
                  {template?.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', margin: '10px 0' }}>
          <TextField
            margin="normal"
            id="upcoming"
            label={t('community.status')}
            aria-label="upcoming"
            value={t('community.upcoming')}
            name="duration"
            style={{ width: '200px' }}
            InputProps={{
              'data-testid': 'plan_status_upcoming'
            }}
            disabled
          />
          {!!emailTemplatesData?.emailTemplates?.length && (
            <TextField
              margin="normal"
              id="payment-reminder-upcoming"
              aria-label="payment reminder upcoming"
              label={t('community.select_template')}
              value={upcomingTemplate}
              onChange={handleTemplates}
              name="upcomingTemplate"
              inputProps={{
                'data-testid': 'payment_reminder_template_upcoming'
              }}
              style={{ width: '200px', marginLeft: '40px' }}
              select
            >
              {emailTemplatesData?.emailTemplates?.map(template => (
                <MenuItem key={template.id} value={template?.id}>
                  {template?.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>
      </div>
      {/* Division targets */}
      <div className={classes.information} style={{ marginTop: '40px' }}>
        <Typography variant="h6">{t('community.lead_management')}</Typography>
        <Typography variant="subtitle1">{t('community.subtitle')}</Typography>
        <Typography variant="caption">{t('community.division_description')}</Typography>
        <Typography variant="caption">{t('community.minimum_divisions')}</Typography>
        {divisionTargetsOptions.map((_menu, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div style={{ display: 'flex', flexDirection: 'row', margin: '10px 0' }} key={i}>
            <div>
              <div style={{ display: 'flex', flexDirection: 'row', margin: '10px 0' }}>
                <TextField
                  id={`${i}-division-input`}
                  style={{ width: '300px' }}
                  label={t('common:form_fields.division')}
                  onChange={event => handleDivisionTargetChange(event, i)}
                  value={objectAccessor(objectAccessor(divisionTargetsOptions, i), 'division')}
                  name="division"
                  data-testid="division-input"
                />
                <TextField
                  id={`${i}-target-input`}
                  style={{ width: '200px' }}
                  className={classes.menuItemRight}
                  label={t('common:form_fields.target')}
                  onChange={event => handleDivisionTargetChange(event, i)}
                  value={objectAccessor(objectAccessor(divisionTargetsOptions, i), 'target')}
                  name="target"
                  data-testid="target-input"
                />
              </div>
            </div>
            <div style={{ paddingTop: '20px' }}>
              <IconButton
                style={{ marginTop: -5 }}
                onClick={() => handleDivisionTargetRemoveRow(i)}
                aria-label="remove-division-target"
                size="large"
              >
                <DeleteOutline />
              </IconButton>
            </div>
          </div>
        ))}
        <div
          className={classes.addIcon}
          role="button"
          onClick={handleAddDivisionTargetsOptions}
          data-testid="division_target_click"
        >
          <AddCircleOutlineIcon />
          <div style={{ marginLeft: '10px', color: 'secondary' }}>
            <Typography align="center" variant="caption">
              {t('common:form_fields.add_division')}
            </Typography>
          </div>
        </div>
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
          {mutationLoading ? <Spinner /> : t('community.update_community')}
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
    leadMonthlyTargets: PropTypes.arrayOf(PropTypes.object),
    templates: PropTypes.shape({
      payment_reminder_template_behind: PropTypes.string,
      payment_reminder_template_upcoming: PropTypes.string
    }),
    imageUrl: PropTypes.string,
    currency: PropTypes.string,
    locale: PropTypes.string,
    language: PropTypes.string,
    tagline: PropTypes.string,
    wpLink: PropTypes.string,
    gaId: PropTypes.string,
    securityManager: PropTypes.string,
    subAdministrator: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    }),
    themeColors: PropTypes.shape({
      primaryColor: PropTypes.string,
      secondaryColor: PropTypes.string
    }),
    bankingDetails: PropTypes.shape({
      bankName: PropTypes.string,
      accountName: PropTypes.string,
      accountNo: PropTypes.string,
      branch: PropTypes.string,
      swiftCode: PropTypes.string,
      sortCode: PropTypes.string,
      address: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
      taxIdNo: PropTypes.string
    }),
    emergencyCallNumber: PropTypes.string,
    smsPhoneNumbers: PropTypes.arrayOf(PropTypes.string),
    // eslint-disable-next-line react/forbid-prop-types
    features: PropTypes.object
  }).isRequired,
  refetch: PropTypes.func.isRequired
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
  },
  menuItemRight: {
    marginLeft: '2.5em'
  },
  preview: {
    marginTop: '10px',
    padding: '0.25rem',
    height: ({ heightValue }) => `${heightValue + 6}px`,
    width: ({ widthValue }) => `${widthValue + 7}px`
  }
}));
