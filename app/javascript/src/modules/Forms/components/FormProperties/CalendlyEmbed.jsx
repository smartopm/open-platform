import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function CalendlyEmbed({ isOpen }) {
  useEffect(() => {
    if (isOpen) {
      window.Calendly.initBadgeWidget({
        url:
          'https://calendly.com/dgdp-amenity1/kiosk?hide_event_type_details=1&hide_gdpr_banner=1',
        parentElement: document.getElementById('calendly'),
        prefill: {},
        utm: {},
      });
    }
  }, [isOpen]);

  function callback(e) {
    if (isCalendlyEvent(e)) {
      console.log('Event name:', e.data.event);
      console.log('Event details:', e.data.payload);
    }
  }

  function isCalendlyEvent(e) {
    return (
      e.origin === 'https://calendly.com' && e.data.event && e.data.event.indexOf('calendly.') === 0
    );
  }

  useEffect(() => {
    window.addEventListener('message', callback);
    return () => {
      window.removeEventListener('keydown', callback);
    };
  }, []);

  if(isOpen) {
      return  <div style={{ width: 320, height: 580 }} />
  }
  return null
}

CalendlyEmbed.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};
