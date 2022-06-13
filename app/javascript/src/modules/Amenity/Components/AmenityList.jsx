import React, { useState } from 'react';
import { Container, Grid, TextField } from '@mui/material';

import AmenityItem from './AmenityItem';
import SpeedDialButton from '../../../shared/buttons/SpeedDial';
import { CustomizedDialogs as CustomizedDialog } from '../../../components/Dialog';

const amenity = {
  title: 'Hello',
  description: 'Description',
  location: '20 Street, Lsk',
  hours: '20:00'
};
export default function AmenityList() {
  const [open, setOpen] = useState(false);

  function handleSaveInfo() {
    console.log('saving amenity');
  }
  return (
    <>
      <CustomizedDialog
        open={open}
        handleModal={() => setOpen(!open)}
        dialogHeader="Configure Amenity"
        displaySaveButton
        handleBatchFilter={handleSaveInfo}
        maxWidth="sm"
        fullWidth
      >
        <TextField
          margin="normal"
          id="account-name"
          label="Amenity Name"
          defaultValue=""
        //   onChange={event => setInputValue({ ...inputValue, accountName: event.target.value })}
          inputProps={{ 'data-testid': 'account_name' }}
          required
          fullWidth
        />
        <TextField
          margin="normal"
          id="account-name"
          label="Description"
          defaultValue=""
          inputProps={{ 'data-testid': 'account_name' }}
          required
          fullWidth
        />
        <TextField
          margin="normal"
          id="account-name"
          label="Location"
          defaultValue=""
          inputProps={{ 'data-testid': 'account_name' }}
          required
          fullWidth
        />
        <TextField
          margin="normal"
          id="account-name"
          label="Hours"
          defaultValue=""
          inputProps={{ 'data-testid': 'account_name' }}
          required
          fullWidth
        />
        <TextField
          margin="normal"
          id="account-name"
          label="Calendly Link"
          defaultValue=""
          inputProps={{ 'data-testid': 'account_name' }}
          required
          fullWidth
        />
      </CustomizedDialog>
      <Container maxWidth="lg">
        <Grid container direction="row">
          <Grid item xs={11}>
            <Grid container spacing={2} direction="row">
              {[1, 2, 3, 5].map(i => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <AmenityItem amenity={amenity} />
                </Grid>
            ))}
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <SpeedDialButton handleAction={() => setOpen(!open)} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
