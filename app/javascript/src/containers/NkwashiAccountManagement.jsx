/* eslint-disable */
import React, { useState } from 'react';
import { useWindowDimensions } from '../utils/customHooks';
import IframeContainer from '../components/IframeContainer';
import { useLocation } from 'react-router-dom';
import { ModalDialog } from '../components/Dialog';
import { TextField } from '@mui/material';

export default function NkwashiAccountManagement() {
  const { width, height } = useWindowDimensions();
  const url = 'https://mythebe.thebe-im.com/index.php/site/login';
  const [isOpen, setIsOpen] = React.useState(false);
  const [loginId, setLoginId] = useState('Not Available');
  const { state } = useLocation();

  function openDialog() {
    setIsOpen(!isOpen);
  }
  function handleClick() {
    window.open(
      `mailto:arrears.nkwashi@thebe-im.com?subject=Thebe Portal Password Rest for ${state.clientName} &body=Hi, my name is ${state.clientName}. Please reset my password for my login id:  ${loginId}`,
      'emailWindow'
    );
    setIsOpen(!isOpen);
  }
  return (
    <React.Fragment>
      <div>
        <div className="d-flex mb-0 justify-content-center">
          <p data-testid="reset_password" onClick={openDialog} style={{ marginTop: '1%' }}>
            <u>
              <strong>Trouble logging in?</strong>
            </u>
          </p>
        </div>
        <ModalDialog
          handleClose={openDialog}
          handleConfirm={handleClick}
          action="Send Email"
          open={isOpen}
        >
          <h6>
            To request your login information or to reset your username and password, email:{' '}
            <a>arrears.nkwashi@thebe-im.com</a>
          </h6>
          <br />
          <TextField
            className="form-control"
            type="text"
            onChange={event => setLoginId(event.target.value)}
            name="loginId"
            placeholder="Enter username (if available) here"
          />
        </ModalDialog>
        <IframeContainer link={url} height={height} width={width} />
      </div>
    </React.Fragment>
  );
}
