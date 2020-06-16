import React from 'react'
import FacebookIcon from '@material-ui/icons/Facebook'
import Button from '@material-ui/core/Button';

export function ShareButton({ url }) {
    function shareFacebook() {
        return window.open('https://www.facebook.com/sharer/sharer.php?u=' + escape(url) + '&t=' + document.title, '',
            'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
    }
    return (
            <Button
                variant="contained"
                color="primary"
                startIcon={<FacebookIcon />}
                onClick={shareFacebook}
            >
                Share Facebook
            </Button>
    )
}




