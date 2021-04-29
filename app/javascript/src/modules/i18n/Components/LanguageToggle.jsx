import React, { useState } from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useTranslation } from 'react-i18next';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import { BootstrapInput } from '../../Dashboard/Components/GuardHome';

export default function LanguageToggle() {
  const savedLang = localStorage.getItem('default-language');
  const [locale, setLocale] = useState(savedLang || 'en-US');
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
          IconComponent={() => <ArrowDropDownIcon style={{ marginLeft: -34 }} />}
          inputProps={{ "data-testid": "language_toggle" }}
        >
          <MenuItem value="en-US" key="en">
            English
          </MenuItem>
          <MenuItem value="es-ES" key="es">
            Spanish
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
