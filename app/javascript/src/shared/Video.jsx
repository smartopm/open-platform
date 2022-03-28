import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Context } from '../containers/Provider/AuthStateProvider';
import { useFetchMedia } from '../utils/customHooks';
import CenteredContent from '../components/CenteredContent';

export default function Video({ src }) {
  const authState = useContext(Context);
  const matches = useMediaQuery('(max-width:600px)')
  const { t } = useTranslation(['common'])
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authState.token}`
    }
  };
  const { response, } = useFetchMedia(src, options);

  return (
    <CenteredContent>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        width={matches ? "100%" : "60%"}
        controls
        src={response.url}
        data-testid="video_component"
      >
        {t('errors.flashlight_not_supported')}
      </video>
    </CenteredContent>
  );
}

Video.propTypes = {
  src: PropTypes.string.isRequired
};
