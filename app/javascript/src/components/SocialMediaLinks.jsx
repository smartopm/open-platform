/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import LanguageIcon from '@material-ui/icons/Language';
import { Typography, IconButton } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';

export default function SocialMediaLinks({ communityName, data }) {
  // TODO: Rename this "data" or extract this function outside the component
  // eslint-disable-next-line no-shadow
  function checkIsValid(data) {
    if (!Array.isArray(data)) {
      return false;
    }

    if (!data.length > 0) {
      return false;
    }

    if (!data.some(d => d.social_link || d.category)) {
      return false;
    }

    return true;
  }

  return (
    <>
      {checkIsValid(data) && (
        <div id="div" className="row justify-content-center">
          <Typography id="connect" className={css(styles.textLink)}>
            Connect with 
            {' '}
            {communityName}
          </Typography>
          {data.map(urlLink => (
            <Fragment key={urlLink.category}>
              {urlLink && urlLink.category && urlLink.category === 'facebook' && (
                <IconButton
                  id="facebook"
                  aria-label="facebook"
                  onClick={() => window.open(`${urlLink.social_link}`, '_blank')}
                >
                  <FacebookIcon className={css(styles.socialIcons)} />
                </IconButton>
              )}
              {urlLink && urlLink.category && urlLink.category === 'twitter' && (
                <IconButton
                  id="twitter"
                  aria-label="twitter"
                  onClick={() => window.open(`${urlLink.social_link}`, '_blank')}
                >
                  <TwitterIcon className={css(styles.socialIcons)} />
                </IconButton>
              )}
              {urlLink && urlLink.category && urlLink.category === 'website' && (
                <IconButton
                  id="website"
                  aria-label="website"
                  onClick={() => window.open(`${urlLink.social_link}`, '_blank')}
                >
                  <LanguageIcon className={css(styles.socialIcons)} />
                </IconButton>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </>
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
});
