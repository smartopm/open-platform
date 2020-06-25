import React, {useState} from 'react'
import FacebookIcon from '@material-ui/icons/Facebook'
import Fab from "@material-ui/core/Fab"
import Box from "@material-ui/core/Box"
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Popper from '@material-ui/core/Popper'
import ShareIcon from '@material-ui/icons/Share';
import WhatsAppIcon from '@material-ui/icons/WhatsApp'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import TwitterIcon from '@material-ui/icons/Twitter'
import ReactGA from 'react-ga'

export function ShareButton({ url }) {
    const [openPopper, setOpenPopper] = useState(false)
     const [anchorEl, setAnchorEl] = useState(null);
    function shareFacebook() {
        ReactGA.event({
        category: 'ShareToFB',
        action: 'NewPageShare',
        eventLabel: "Facebook Share",
        nonInteraction: true
        });
        return window.open('https://www.facebook.com/sharer/sharer.php?u=' + escape(url) + '&t=' + document.title, '',
            'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');

    }
    function handleClick(event){
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

        <Box style={{display: 'flex', flexDirection: 'column', margin: 10 }}>
            <Fab>
                <TwitterIcon />
            </Fab>
            <Fab>
                <LinkedInIcon />
            </Fab>
            <Fab onClick={shareFacebook}>
                <FacebookIcon />    
            </Fab>
             <Fab>
                <MailOutlineIcon />    
            </Fab>
             <Fab>
                <WhatsAppIcon />    
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




