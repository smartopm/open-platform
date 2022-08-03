import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import BusinessForm from '../Components/BusinessForm';

describe('Business  form', () => {
  it('should allow editing business fields inputs', async () => {
    const handleClose = jest.fn();
    const container = render(
      <MockedProvider>
        <BusinessForm close={handleClose} />
      </MockedProvider>
    );

    fireEvent.change(container.queryByTestId('business_name'), {
      target: { value: 'new campaign' },
    });
    expect(container.queryByTestId('business_name').value).toBe('new campaign');

    fireEvent.change(container.queryByTestId('business_email'), {
      target: { value: 'newbusiness@gm.ail' },
    });
    expect(container.queryByTestId('business_email').value).toBe('newbusiness@gm.ail');

    fireEvent.change(container.queryByTestId('business_phone_number'), {
      target: { value: '6353472323' },
    });
    expect(container.queryByTestId('business_phone_number').value).toBe('6353472323');

    fireEvent.change(container.queryByTestId('business_link'), {
      target: { value: 'https://ulr.com' },
    });
    expect(container.queryByTestId('business_link').value).toBe('https://ulr.com');

    fireEvent.change(container.queryByTestId('business_address'), {
      target: { value: 'Plot 32, Nkwashi' },
    });
    expect(container.queryByTestId('business_address').value).toBe('Plot 32, Nkwashi');

    fireEvent.change(container.queryByTestId('business_operating_hours'), {
      target: { value: '6-7' },
    });
    expect(container.queryByTestId('business_operating_hours').value).toBe('6-7');

    fireEvent.change(container.queryByTestId('business_image'), {
      target: { value: 'https:image.jepg' } });
    expect(container.queryByTestId('business_image').value).toBe('https:image.jepg');

    fireEvent.change(container.queryByTestId('business_description'), {
      target: { value: 'described as following bring change to startups' },
    });
    expect(container.queryByTestId('business_description').value).toBe(
      'described as following bring change to startups'
    );

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

    fireEvent.change(container.queryByTestId('business_name'), { target: { value: 'new campaign' } });
    expect(container.queryByTestId('business_name').value).toBe('new campaign');

    fireEvent.change(container.queryByTestId('business_email'), {
      target: { value: 'newbusiness@gm.ail' },
    });
    expect(container.queryByTestId('business_email').value).toBe('newbusiness@gm.ail');

    fireEvent.change(container.queryByTestId('business_phone_number'), {
      target: { value: '6353472323' },
    });
    expect(container.queryByTestId('business_phone_number').value).toBe('6353472323');

    fireEvent.change(container.queryByTestId('business_link'), {
      target: { value: 'https://ulr.com' },
    });
    expect(container.queryByTestId('business_link').value).toBe('https://ulr.com');

    fireEvent.change(container.queryByTestId('business_address'), {
      target: { value: 'Plot 32, Nkwashi' },
    });
    expect(container.queryByTestId('business_address').value).toBe('Plot 32, Nkwashi');

    fireEvent.change(container.queryByTestId('business_operating_hours'), {
      target: { value: '6-7' },
    });
    expect(container.queryByTestId('business_operating_hours').value).toBe('6-7');

    fireEvent.change(container.queryByTestId('business_image'), {
      target: { value: 'https:image.jepg' },
    });
    expect(container.queryByTestId('business_image').value).toBe('https:image.jepg');

    fireEvent.change(container.queryByTestId('business_description'), {
      target: { value: 'described as following bring change to startups' },
    });
    expect(container.queryByTestId('business_description').value).toBe(
      'described as following bring change to startups'
    );

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
