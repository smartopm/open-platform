import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import BusinessForm from '../Components/BusinessForm';

describe('Business  form', () => {
  // eslint-disable-next-line max-statements
  it('should allow editing business fields inputs', async () => {
    const handleClose = jest.fn();
    const container = render(
      <MockedProvider>
        <BusinessForm close={handleClose} />
      </MockedProvider>
    );
    const businessName = container.queryByTestId('business_name');
    const businessEmail = container.queryByTestId('business_email');
    const businessPhone = container.queryByTestId('business_phone_number');
    const businessLink = container.queryByTestId('business_link');
    const businessDesc = container.queryByTestId('business_description');
    const businessAddress = container.queryByTestId('business_address');
    const businessHours = container.queryByTestId('business_operating_hours');
    const businessImage = container.queryByTestId('business_image');

    fireEvent.change(businessName, { target: { value: 'new campaign' } });
    expect(businessName.value).toBe('new campaign');

    fireEvent.change(businessEmail, { target: { value: 'newbusiness@gm.ail' } });
    expect(businessEmail.value).toBe('newbusiness@gm.ail');

    fireEvent.change(businessPhone, { target: { value: '6353472323' } });
    expect(businessPhone.value).toBe('6353472323');

    fireEvent.change(businessLink, { target: { value: 'https://ulr.com' } });
    expect(businessLink.value).toBe('https://ulr.com');

    fireEvent.change(businessAddress, { target: { value: 'Plot 32, Nkwashi' } });
    expect(businessAddress.value).toBe('Plot 32, Nkwashi');

    fireEvent.change(businessAddress, { target: { value: 'Plot 32, Nkwashi' } });
    expect(businessAddress.value).toBe('Plot 32, Nkwashi');

    fireEvent.change(businessHours, { target: { value: '6-7' } });
    expect(businessHours.value).toBe('6-7');

    fireEvent.change(businessImage, { target: { value: 'https:image.jepg' } });
    expect(businessImage.value).toBe('https:image.jepg');

    fireEvent.change(businessDesc, {
      target: { value: 'described as following bring change to startups' }
    });
    expect(businessDesc.value).toBe('described as following bring change to startups');

    const submit = container.queryByText('form_actions.create_business');
    const cancel = container.queryByText('form_actions.cancel');
    expect(submit).toBeInTheDocument();
    expect(container.queryByText('form_actions.cancel')).toBeInTheDocument();

    fireEvent.click(cancel);
    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
      fireEvent.click(submit);
    }, 5)
  });

  // eslint-disable-next-line max-statements
  it('should allow updating business fields', async () => {
    const handleClose = jest.fn();
    const businessData = {
      category: 'health',
      createdAt: '2020-06-30T15:54:34Z',
      homeUrl: '',
      name: 'Artist',
      userId: '4f1492a9-5451-4f0a-b35d-bc567e1e56b7',
      id: '43c596de-e07f-4d0f-a727-53fb4b8b44ce',
      description: '789',
      status: 'verified'
    };

    const container = render(
      <MockedProvider>
        <BusinessForm close={handleClose} businessData={businessData} action="edit" />
      </MockedProvider>
    );

    const businessName = container.queryByTestId('business_name');
    const businessEmail = container.queryByTestId('business_email');
    const businessPhone = container.queryByTestId('business_phone_number');
    const businessLink = container.queryByTestId('business_link');
    const businessDesc = container.queryByTestId('business_description');
    const businessAddress = container.queryByTestId('business_address');
    const businessHours = container.queryByTestId('business_operating_hours');
    const businessImage = container.queryByTestId('business_image');

    fireEvent.change(businessName, { target: { value: 'new campaign' } });
    expect(businessName.value).toBe('new campaign');

    fireEvent.change(businessEmail, { target: { value: 'newbusiness@gm.ail' } });
    expect(businessEmail.value).toBe('newbusiness@gm.ail');

    fireEvent.change(businessPhone, { target: { value: '6353472323' } });
    expect(businessPhone.value).toBe('6353472323');

    fireEvent.change(businessLink, { target: { value: 'https://ulr.com' } });
    expect(businessLink.value).toBe('https://ulr.com');

    fireEvent.change(businessAddress, { target: { value: 'Plot 32, Nkwashi' } });
    expect(businessAddress.value).toBe('Plot 32, Nkwashi');

    fireEvent.change(businessAddress, { target: { value: 'Plot 32, Nkwashi' } });
    expect(businessAddress.value).toBe('Plot 32, Nkwashi');

    fireEvent.change(businessHours, { target: { value: '6-7' } });
    expect(businessHours.value).toBe('6-7');

    fireEvent.change(businessImage, { target: { value: 'https:image.jepg' } });
    expect(businessImage.value).toBe('https:image.jepg');

    fireEvent.change(businessDesc, {
      target: { value: 'described as following bring change to startups' }
    });
    expect(businessDesc.value).toBe('described as following bring change to startups');

    const submit = container.queryByText('form_actions.update_business');
    const cancel = container.queryByText('form_actions.cancel');
    expect(submit).toBeInTheDocument();
    expect(container.queryByText('form_actions.cancel')).toBeInTheDocument();

    fireEvent.click(cancel);
    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
      fireEvent.click(submit);
    }, 10);
  });
});
