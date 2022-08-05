import React, { useState, useContext } from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTranslation } from 'react-i18next';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import { BootstrapInput, languages } from '../../../utils/constants';
import { Context } from '../../../containers/Provider/AuthStateProvider';

export default function LanguageToggle() {
  const savedLang = localStorage.getItem('default-language');
  const authState = useContext(Context);
  const defaultLanguage = authState.user?.community.language;
  const languageOptions = authState.user?.community?.supportedLanguages || languages;
  /* if the user has not set their language,
  ** then we initially show them the community default language
  ** else we show them the fallback language */
  const [locale, setLocale] = useState(savedLang || defaultLanguage || 'en-US');
  const { i18n } = useTranslation();

  function saveLocale(event) {
    const lang = event.target.value;
    setLocale(lang);
    localStorage.setItem('default-language', lang);
    return i18n.changeLanguage(lang);
  }

  return (
    <div style={{ float: 'right', marginRight: '8.6%' }}>
      <br />
      <GTranslateIcon style={{ marginTop: 12, marginRight: -6 }} />
      <FormControl variant="filled" style={{ fontSize: 15, fontWeight: 'medium', paddingLeft: 6 }}>
        <Select
          id="language_toggle"
          value={locale}
          onChange={saveLocale}
          variant="filled"
          input={<BootstrapInput />}
          IconComponent={() => <ArrowDropDownIcon size='small' style={{ marginLeft: -34 }} />}
          inputProps={{ 'data-testid': 'language_toggle' }}
        >
          {Object.entries(languageOptions).map(([key, val]) => (
            <MenuItem key={val} value={val}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
