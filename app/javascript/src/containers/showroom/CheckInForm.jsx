/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React, { useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, MenuItem } from '@mui/material';
import { css, StyleSheet } from 'aphrodite';
import { useMutation } from 'react-apollo';
import { infoSource } from '../../utils/constants';
import { Footer } from '../../components/Footer';
import { createShowroomEntry, EntryRequestCreate } from '../../graphql/mutations';

/**
 * 
 * @param {Object} history 
 * @returns ReactNode
 * @deprecated we need to confirm whether the showroom feature is used and if not we remove it
 * No changes have been made to it since the first launch of the feature, logs are here https://x.doublegdp.com/showroom_logs 
 */
export default function ClientForm({ history }) {
  const { register, handleSubmit, errors } = useForm();
  const [isSubmitted] = useState(false);
  const [selectedSource, setReason] = useState('');
  const [createEntryShowroom] = useMutation(createShowroomEntry);
  const [createEntryRequest] = useMutation(EntryRequestCreate);
  const onSubmit = data => {
    const user = {
      name: `${data.name} ${data.surname}`,
      phoneNumber: data.phoneNumber,
      nrc: data.nrc,
      email: data.email,
      homeAddress: data.homeAddress,
      reason: data.reason,
      source: 'showroom'
    };

    createEntryShowroom({ variables: user })
      .then(() => {
        return createEntryRequest({ variables: user });
      })
      .then(() => {
        history.push('/sh_complete/');
      });
  };

  const handleSourceChange = event => {
    setReason(event.target.value);
  };
  return (
    <>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <h3>Nkwashi Showroom Check-In</h3>

          <p className={css(styles.infoText)}>
            Please enter your contact information below so that we can follow-up with you after
            today’s meeting and to more quickly set you up for access at the gate when you visit
            Nkwashi in-person
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="name">
              Name
            </label>
            <input
              className="form-control"
              type="text"
              ref={register({ required: true })}
              name="name"
              defaultValue=""
              autoCapitalize="words"
            />
          </div>
          {errors.name && <p className="text-danger">The name is required</p>}
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="surname">
              Surname
            </label>
            <input
              className="form-control"
              type="text"
              ref={register}
              name="surname"
              defaultValue=""
              autoCapitalize="words"
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="email">
              Email
            </label>
            <input
              className="form-control"
              type="email"
              ref={register}
              name="email"
              defaultValue=""
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="nrc">
              NRC
            </label>
            <input className="form-control" type="text" ref={register} name="nrc" defaultValue="" />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="phone_number">
              Phone Number
            </label>
            <input
              className="form-control"
              type="text"
              ref={register}
              name="phoneNumber"
              defaultValue=""
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="homeAddress">
              Home Address
            </label>
            <input
              className="form-control"
              type="text"
              ref={register}
              name="homeAddress"
              defaultValue=""
              placeholder="Plot 89, St Luis street, Meanwood, Lusaka"
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="reason">
              Reason for Visit
            </label>
            <input
              className="form-control"
              type="text"
              ref={register}
              name="reason"
              defaultValue=""
            />
          </div>
          <div className="form-group">
            <TextField
              id="source"
              select
              label="How did You Learn About Nkwashi"
              name="source"
              value={selectedSource}
              onChange={handleSourceChange}
              className={`${css(styles.selectInput)}`}
            >
              {infoSource.map(source => (
                <MenuItem key={source} value={source}>
                  {source}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="row justify-content-center align-items-center ">
            <Button
              variant="contained"
              className={`${css(styles.logButton)}`}
              type="submit"
              disabled={isSubmitted}
              color="primary"
            >
              {isSubmitted ? 'Submitting ...' : ' Check In'}
            </Button>
          </div>
        </form>
        <Footer position="5vh" />
      </div>
    </>
  );
}
const styles = StyleSheet.create({
  welcomePage: {
    position: ' absolute',
    left: ' 50%',
    top: ' 50%',
    '-webkit-transform': ' translate(-50%, -50%)',
    transform: ' translate(-50%, -50%)'
  },
  logButton: {
    width: '75%',
    boxShadow: 'none',
    marginTop: 60,
    height: 50
  },
  selectInput: {
    width: '100%'
  },
  infoText: {
    color: '#818188',
    margin: 40
  }
});
