import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function CalendlyEmbed({ isOpen, submitForm }) {
  const [scheduled, setIsScheduled] = useState(false)
  useEffect(() => {
    if (isOpen && window.Calendly) {
       window.Calendly.initPopupWidget({
        url:
          'https://calendly.com/dgdp-amenity1/kiosk?hide_event_type_details=1&hide_gdpr_banner=1',
      });
      return
    }
    if(scheduled) {
      window.Calendly = null
    }
  }, [isOpen, scheduled]);

  function callback(e) {
    if (isCalendlyEvent(e)) {
      if(e.data.event === 'calendly.event_scheduled') {
        window.Calendly = null
        setIsScheduled(true)
        // submit the form from here
        submitForm()
      }
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

  return null
}

CalendlyEmbed.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  submitForm: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};