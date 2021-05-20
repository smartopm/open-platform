import React, { useState } from 'react';
import Fab from '@material-ui/core/Fab';
import Box from '@material-ui/core/Box';
import Popper from '@material-ui/core/Popper';
import ShareIcon from '@material-ui/icons/Share';
import ReactGA from 'react-ga';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import CheckCircleIconBase from '@material-ui/icons/CheckCircle';
import {
  FacebookShareButton,
  EmailShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  EmailIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'aphrodite';
import { copyText } from '../utils/helpers';

export function ShareButton({ url, styles, doOnShare, communityName }) {
  const [openPopper, setOpenPopper] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(['common', 'news']);

  function onShareClick(linkType) {
    doOnShare();
    ReactGA.event({
      category: `ShareTo${linkType}`,
      action: 'NewPageShare',
      eventLabel: `${linkType}Share`,
      nonInteraction: true
    });
  }
  function handleClick(event) {
    setOpenPopper(!openPopper);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }
  function handleCopy(postUrl) {
    if (copyText(postUrl)) {
      setOpen(!open);
      doOnShare();
    }
  }
  function onEmailClick() {
    doOnShare();
  }

  return (
    <>
      <Popper placement="top" open={openPopper} anchorEl={anchorEl}>
        <Box style={{ display: 'flex', flexDirection: 'column', margin: 10 }}>
          <TwitterShareButton
            url={url}
            onClick={() => onShareClick('twitter')}
            data-testid="twitter"
          >
            <TwitterIcon size={50} round />
          </TwitterShareButton>

          <LinkedinShareButton
            url={url}
            title={document.title}
            onClick={() => onShareClick('linkedIn')}
            data-testid="linkedIn"
          >
            <LinkedinIcon size={50} round />
          </LinkedinShareButton>
          <WhatsappShareButton
            url={url}
            title={document.title}
            onClick={() => onShareClick('whatsApp')}
            data-testid="whatsapp"
          >
            <WhatsappIcon size={50} round />
          </WhatsappShareButton>
          <EmailShareButton
            url={url}
            subject={document.title}
            body={`Hi, visit ${communityName} news page`}
            beforeOnClick={onEmailClick}
            data-testid="email"
          >
            <EmailIcon size={50} round />
          </EmailShareButton>
          <FacebookShareButton
            url={url}
            title={document.title}
            onClick={() => onShareClick('facebook')}
            data-testid="facebook"
          >
            <FacebookIcon size={50} round />
          </FacebookShareButton>
          <Fab size="medium" onClick={() => handleCopy(url)} data-testid="copy">
            <FileCopyOutlinedIcon />
          </Fab>
        </Box>
      </Popper>

      <Fab variant="extended" style={styles} color="primary" onClick={handleClick}>
        <ShareIcon />
        {'  '} 
        {' '}
        {t('common:misc.share')}
      </Fab>
      <div className="row container flex-row">
        <Snackbar
          className="snackBar"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(!open)}
          color="primary"
        >
          <SnackbarContent
            message={(
              <div className="row d-flex m-20">
                <CheckCircleIconBase />
                <span className="justify-content-center" id="client-snackbar">
                  {t('common:misc.copied')}
                </span>
              </div>
            )}
          />
        </Snackbar>
      </div>
    </>
  );
}

ShareButton.defaultProps = {
  styles: {
    position: 'fixed',
    bottom: 24,
    right: 57
  },
  doOnShare: () => {}
};
ShareButton.propTypes = {
  styles: PropTypes.shape({
    position: PropTypes.string,
    bottom: PropTypes.number,
    right: PropTypes.number
  }),
  url: PropTypes.string.isRequired,
  doOnShare: PropTypes.func,
  communityName: PropTypes.string.isRequired
};

export const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#69ABA4',
    minHeight: '50px'
  },
  getStartedButton: {
    color: '#FFF',
    height: 51,
    boxShadow: 'none',
    position: 'fixed',
    backgroundColor: '#69ABA4',
    bottom: 20,
    right: 57,
    marginLeft: '30%'
  }
});
