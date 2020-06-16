import React from 'react'
import FacebookIcon from '@material-ui/icons/Facebook'
import Fab from "@material-ui/core/Fab";

export function ShareButton({ url }) {
    function shareFacebook() {
        return window.open('https://www.facebook.com/sharer/sharer.php?u=' + escape(url) + '&t=' + document.title, '',
            'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
    }
    return (
        <Fab variant="extended"
            style={{
                position: 'fixed',
                bottom: 24,
                right: 57,
            }}
            color="primary"
            onClick={shareFacebook}
        >
            <FacebookIcon />
            {"  "} Share on Facebook
        </Fab>
    )
}




