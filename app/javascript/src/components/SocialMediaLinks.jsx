/* eslint-disable */
import React, { Fragment } from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LanguageIcon from '@mui/icons-material/Language';
import { Typography, IconButton } from '@mui/material'
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
                                <IconButton
                                    id="facebook"
                                    aria-label="facebook"
                                    onClick={()=> window.open(`${link.social_link}`,'_blank')}
                                    size="large">
                                    <FacebookIcon className={css(styles.socialIcons)} />
                                </IconButton>
                            )}
                            {link && link.category && link.category === 'twitter' && (
                                <IconButton
                                    id="twitter"
                                    aria-label="twitter"
                                    onClick={(()=> window.open(`${link.social_link}`,'_blank'))}
                                    size="large">
                                    <TwitterIcon className={css(styles.socialIcons)} />
                                </IconButton>
                            )}
                            {link && link.category && link.category === 'website' && (
                                <IconButton
                                    id="website"
                                    aria-label="website"
                                    onClick={(()=> window.open(`${link.social_link}`,'_blank'))}
                                    size="large">
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

