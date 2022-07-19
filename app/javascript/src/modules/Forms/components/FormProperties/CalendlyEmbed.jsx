import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { calendlyCallback } from '../../utils';

export default function CalendlyEmbed({ isOpen, submitForm }) {
  useEffect(() => {
    if (isOpen && window.Calendly) {
       window.Calendly.initPopupWidget({
        url:
          'https://calendly.com/dgdp-amenity1/kiosk?hide_event_type_details=1&hide_gdpr_banner=1',
      });
    }
  }, [isOpen]);


  useEffect(() => {
    window.addEventListener('message', event => calendlyCallback(event, submitForm));
    return () => {
      window.removeEventListener('message', event => calendlyCallback(event, submitForm));
    };
  }, []);

  return null
}

CalendlyEmbed.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  submitForm: PropTypes.func.isRequired,
};