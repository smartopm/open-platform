import React, { Fragment } from 'react';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import LanguageIcon from '@material-ui/icons/Language';
import { Typography, IconButton } from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'


export default function SocialMediaLinks() {

    return (
        <Fragment>
            <div className="row justify-content-center" >

                <Typography className={css(styles.textLink)}>
                    Connect with Nkwashi
                </Typography>
                <IconButton onClick={(()=> window.open('https://www.facebook.com/nkwashi.soar/','_blank'))}>
                    <FacebookIcon className={css(styles.socialIcons)} />
                </IconButton>
                <IconButton onClick={(()=> window.open('https://twitter.com/Nkwashi_','_blank'))}>
                    <TwitterIcon className={css(styles.socialIcons)} />
                </IconButton>
                <IconButton onClick={(()=> window.open('http://nkwashi.com/','_blank'))}>
                    <LanguageIcon className={css(styles.socialIcons)} />
                </IconButton>

            </div>
        </Fragment>
    );

}

const styles = StyleSheet.create({
    socialIcons: {
        color: '#8c8c93'
    },
    textLink: {
        color: '#8c8c93',
        marginTop: 13
    }
})

