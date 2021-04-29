import React, { useState } from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import { BootstrapInput } from '../../Dashboard/Components/GuardHome';

export default function LanguageToggle() {
  const [locale, setLocale] = useState('en-US');
  function handleChange() {
    setLocale('en');
  }
  return (
    <div style={{ float: 'right' }}>
      <br />
      <GTranslateIcon style={{ marginTop: 12 }} />
      <FormControl variant="filled">
        <Select
          id="demo-simple-select-outlined"
          value={locale}
          onChange={handleChange}
          style={{width: 180}}
          variant="filled"
          input={<BootstrapInput />}
          IconComponent={() => <ArrowDropDownIcon style={{ marginLeft: -34 }} />}
        >
          <MenuItem value="en-US" key="en">
            English
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
