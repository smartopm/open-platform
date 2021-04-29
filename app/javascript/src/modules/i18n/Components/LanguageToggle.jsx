import React, { useState } from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useTranslation } from 'react-i18next';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import { BootstrapInput } from '../../Dashboard/Components/GuardHome';

export default function LanguageToggle() {
  const savedLang = localStorage.getItem('locale');
  const [locale, setLocale] = useState(savedLang || 'en-US');
  const { i18n, t } = useTranslation();

  function saveLocale(event) {
    const lang = event.target.value;
    setLocale(lang);
    localStorage.setItem('locale', lang);
   return i18n.changeLanguage(lang);
  }

  return (
    <div style={{ float: 'right' }}>
      <br />
      <GTranslateIcon style={{ marginTop: 12 }} />
      <FormControl variant="filled">
        <Select
          id="demo-simple-select-outlined"
          value={locale}
          onChange={saveLocale}
          style={{ width: 150 }}
          variant="filled"
          input={<BootstrapInput />}
          IconComponent={() => <ArrowDropDownIcon style={{ marginLeft: -34 }} />}
        >
          <MenuItem value="en-US" key="en">
            {t('login.login_text')}
          </MenuItem>
          <MenuItem value="es-ES" key="es">
            Spanish
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
