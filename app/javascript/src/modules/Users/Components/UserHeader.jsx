import React, { useState, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import SelectButton from '../../../shared/buttons/SelectButton';
import { objectAccessor } from '../../../utils/helpers';

export default function UserHeader({ setCampaignOption }) {
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState('');
  const anchorRef = useRef(null);
  const options = {
    all: 'All',
    all_on_the_page: 'All on this page',
    none: 'none'
  };

  const selectedOptions =
    selectedKey === 'none' || selectedKey === '' ? 'select' : objectAccessor(options, selectedKey);

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleMenuItemClick(key) {
    setCampaignOption(key);
    setSelectedKey(key);
    setOpen(false);
  }
  return (
    <Grid container>
      <Grid item lg={12} md={12} sm={12}>
        <Typography variant="h5">Users</Typography>
      </Grid>
      <Grid item lg={3} md={3} sm={3}>
        <SelectButton
          buttonText={selectedOptions}
          open={open}
          anchorEl={anchorRef.current}
          anchorRef={anchorRef}
          handleClose={handleClose}
          options={options}
          selectedKey={selectedKey}
          handleMenuItemClick={handleMenuItemClick}
          handleClick={() => setOpen(!open)}
        />
      </Grid>
    </Grid>
  );
}
