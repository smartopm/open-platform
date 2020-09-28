import React, { useState } from 'react'
import Fab from "@material-ui/core/Fab"
import Box from "@material-ui/core/Box"
import Popper from '@material-ui/core/Popper'
import ShareIcon from '@material-ui/icons/Share';
import ReactGA from 'react-ga'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { Snackbar, SnackbarContent } from '@material-ui/core'
import CheckCircleIconBase from "@material-ui/icons/CheckCircle";
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
} from 'react-share'
import PropTypes from 'prop-types'
import { StyleSheet } from 'aphrodite';
import { copyText } from '../utils/helpers'

export function ShareButton({ url, styles, doOnShare }) {
    const [openPopper, setOpenPopper] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false)

    function onShareClick(linkType) {
        doOnShare()
        ReactGA.event({
            category: `ShareTo${linkType}`,
            action: 'NewPageShare',
            eventLabel: `${linkType}Share`,
            nonInteraction: true
        });
    }
    function handleClick(event) {
        setOpenPopper(!openPopper)
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }
    function handleCopy(postUrl) {
        if (copyText(postUrl)) {
            setOpen(!open)
            doOnShare()
            
        }
    }
    function onEmailClick() {
        doOnShare()
    }

    return (
      <>
        <Popper
          placement="top"
          open={openPopper}
          anchorEl={anchorEl}
        >
          <Box style={{ display: 'flex', flexDirection: 'column', margin: 10 }}>

            <TwitterShareButton url={url} onClick={() => onShareClick('twitter')}>
              <TwitterIcon size={50} round />
            </TwitterShareButton>

            <LinkedinShareButton url={url} title={document.title} onClick={() => onShareClick('linkedIn')}>
              <LinkedinIcon size={50} round />
            </LinkedinShareButton>
            <WhatsappShareButton url={url} title={document.title} onClick={() => onShareClick('whatsApp')}>
              <WhatsappIcon size={50} round />
            </WhatsappShareButton>
            <EmailShareButton url={url} subject={document.title} body={"Hi, vist Nkwashi's news page"} beforeOnClick={onEmailClick}>
              <EmailIcon size={50} round />
            </EmailShareButton>
            <FacebookShareButton url={url} title={document.title} onClick={() => onShareClick('facebook')}>
              <FacebookIcon size={50} round />
            </FacebookShareButton>
            <Fab size="medium" onClick={() => handleCopy(url)}>
              <FileCopyOutlinedIcon />
            </Fab>
          </Box>
        </Popper>

        <Fab
          variant="extended"
          style={styles}
          color="primary"
          onClick={handleClick}
        >
          <ShareIcon />
          {"  "}
          {' '}
          Share
        </Fab>
        <div className="row container flex-row">
          <Snackbar
            className="snackBar"
            anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(!open)}
          >
            <SnackbarContent
              style={{
                            backgroundColor: '#69ABA4',
                        }}
              message={(
                <div className="row d-flex m-20">
                  <CheckCircleIconBase />
                  <span className="justify-content-center" id="client-snackbar">
                    Copied to Clipboard!
                  </span>
                </div>
                          )}
            />
          </Snackbar>
        </div>
      </>
    )
}


ShareButton.defaultProps = {
    styles: {
        position: 'fixed',
        bottom: 24,
        right: 57
    },
    doOnShare: () => {},
}
ShareButton.propTypes = {
    styles: PropTypes.shape({
        position: PropTypes.string,
        bottom: PropTypes.number,
        right: PropTypes.number,
    }),
    url: PropTypes.string.isRequired,
    doOnShare: PropTypes.func
}

export const styles = StyleSheet.create({
    appBar: {
        backgroundColor: '#69ABA4',
        minHeight: '50px'
    },
    getStartedButton: {
        color: "#FFF",
        height: 51,
        boxShadow: "none",
        position: 'fixed',
        backgroundColor: '#69ABA4',
        bottom: 20,
        right: 57,
        marginLeft: '30%',
    },

})
