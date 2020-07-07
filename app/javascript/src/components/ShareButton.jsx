import React, { useState } from 'react'
import Fab from "@material-ui/core/Fab"
import Box from "@material-ui/core/Box"
import Popper from '@material-ui/core/Popper'
import ShareIcon from '@material-ui/icons/Share';
import ReactGA from 'react-ga'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { Snackbar, SnackbarContent } from '@material-ui/core'
import CheckCircleIconBase from "@material-ui/icons/CheckCircle";
import { copyText } from '../utils/helpers'
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
export function ShareButton({ url, styles }) {
    const [openPopper, setOpenPopper] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false)

    function onShareClick(linkType) {
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
    function handleCopy(url) {
        if (copyText(url)) {
            setOpen(!open)
            return
        }
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
                    </TwitterShareButton >

                    <LinkedinShareButton url={url} title={document.title} onClick={() => onShareClick('linkedIn')}>
                        <LinkedinIcon size={50} round />
                    </LinkedinShareButton>
                    <WhatsappShareButton url={url} title={document.title} onClick={() => onShareClick('whatsApp')}>
                        <WhatsappIcon size={50} round />
                    </WhatsappShareButton>
                    <EmailShareButton url={url} subject={document.title} body={"Hi, vist Nkwashi's news page"}>
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
                {"  "} Share
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
                            backgroundColor: '#25c0b0',
                        }}
                        message={
                            <div className="row d-flex m-20">
                                <CheckCircleIconBase />
                                <span className="justify-content-center" id="client-snackbar">
                                    Copied to Clipboard!
                                </span>
                            </div>
                        }
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
    }
}
ShareButton.propTypes = {
    styles: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
}

export const styles = StyleSheet.create({
    appBar: {
        backgroundColor: '#25c0b0',
        minHeight: '50px'
    },
    getStartedButton: {
        backgroundColor: "#25c0b0",
        color: "#FFF",
        height: 51,
        boxShadow: "none",
        position: 'fixed',
        bottom: 20,
        right: 57,
        marginLeft: '30%',
    },
})
