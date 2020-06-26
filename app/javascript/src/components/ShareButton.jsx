import React, { useState } from 'react'
// import FacebookIcon from '@material-ui/icons/Facebook'
import Fab from "@material-ui/core/Fab"
import Box from "@material-ui/core/Box"
import Popper from '@material-ui/core/Popper'
import ShareIcon from '@material-ui/icons/Share';
import ReactGA from 'react-ga'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import {copyText} from '../utils/helpers'
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

export function ShareButton({ url }) {
    const [openPopper, setOpenPopper] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);


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

    return (
        <>

            <Popper
                placement="top"
                open={openPopper}
                anchorEl={anchorEl}
            >
                <Box style={{ display: 'flex', flexDirection: 'column', margin: 10 }}>
               
                    <TwitterShareButton url={url} onClick={()=>onShareClick('twitter')}>
                        <TwitterIcon size={50} round />
                    </TwitterShareButton >
                
                    <LinkedinShareButton url={url} title={document.title} onClick={()=>onShareClick('linkedIn')}>
                        <LinkedinIcon size={50} round />
                    </LinkedinShareButton>
                    <WhatsappShareButton url={url} title={document.title} onClick={()=>onShareClick('whatsApp')}>
                        <WhatsappIcon size={50} round />
                    </WhatsappShareButton>
                    <EmailShareButton url={url} onClick={()=>onShareClick('email')}>
                        <EmailIcon size={50} round />
                    </EmailShareButton>
                    <FacebookShareButton url={url} title={document.title} onClick={()=>onShareClick('facebook')}>
                        <FacebookIcon size={50} round />
                    </FacebookShareButton>
                    <Fab size="medium" onClick={()=>copyText(url)}>
                    <FileCopyOutlinedIcon />
                    </Fab>
                </Box>
            </Popper>

            <Fab variant="extended"
                style={{
                    position: 'fixed',
                    bottom: 24,
                    right: 57
                }}
                color="primary"
                onClick={handleClick}
            >
                <ShareIcon />
                {"  "} Share
        </Fab>
        </>
    )
}




