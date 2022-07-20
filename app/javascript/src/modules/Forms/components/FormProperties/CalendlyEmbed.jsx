import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { calendlyCallback } from '../../utils';

export default function CalendlyEmbed({ isOpen, submitForm, appointmentValue }) {
  useEffect(() => {
    if (isOpen && window.Calendly) {
      window.Calendly.initPopupWidget({ url: appointmentValue.value });
    }
  }, [appointmentValue.value, isOpen]);

  useEffect(() => {
    window.addEventListener('message', event => calendlyCallback(event, submitForm));
    return () => {
      window.removeEventListener('message', event => calendlyCallback(event, submitForm));
    };
  }, []);

  return null;
}

CalendlyEmbed.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  submitForm: PropTypes.func.isRequired,
  appointmentValue: PropTypes.shape({
    value: PropTypes.string,
  }).isRequired,
};
