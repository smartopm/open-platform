/* eslint-disable */
import React, { Fragment } from 'react';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import LanguageIcon from '@material-ui/icons/Language';
import { Typography, IconButton } from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'


export default function SocialMediaLinks({ communityName, data }) {
    function checkIsValid(data){
        if(!Array.isArray(data)) {
            return false;
        }

        if (!data.length > 0) {
            return false;
        }

        if (!data.some(d => d.social_link || d.category)){
            return false;
        }

        return true;
    }

    return (
        <Fragment>
            {checkIsValid(data) && (
                <div id="div" className="row justify-content-center" >
                    <Typography id="connect" className={css(styles.textLink)}>
                        Connect with {communityName}
                    </Typography>
                    {data.map(link => (
                        <Fragment key={link.category}>
                            {link && link.category && link.category === 'facebook' && (
                                <IconButton id="facebook" aria-label="facebook" onClick={()=> window.open(`${link.social_link}`,'_blank')}>
                                    <FacebookIcon className={css(styles.socialIcons)} />
                                </IconButton>
                            )}
                            {link && link.category && link.category === 'twitter' && (
                                <IconButton id="twitter" aria-label="twitter" onClick={(()=> window.open(`${link.social_link}`,'_blank'))}>
                                    <TwitterIcon className={css(styles.socialIcons)} />
                                </IconButton>
                            )}
                            {link && link.category && link.category === 'website' && (
                                <IconButton id="website" aria-label="website" onClick={(()=> window.open(`${link.social_link}`,'_blank'))}>
                                    <LanguageIcon className={css(styles.socialIcons)} />
                                </IconButton>
                            )}
                        </Fragment>
                    ))}
                 </div>
            )}
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

