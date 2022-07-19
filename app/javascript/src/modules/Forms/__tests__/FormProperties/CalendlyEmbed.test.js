import { render } from '@testing-library/react';
import React from 'react';
import CalendlyEmbed from '../../components/FormProperties/CalendlyEmbed';

describe('Calendly Embed', () => {
  window.Calendly = {
    initPopupWidget: jest.fn(({ url }) => url),
  };
  it('should render the embed properly', () => {
    const submit = jest.fn();
    render(<CalendlyEmbed isOpen submitForm={submit} appointmentValue={{ value: "https://calendly.com/dgdp-amenity1" }} />);

    expect(window.Calendly.initPopupWidget).toBeCalled();
  });
});
