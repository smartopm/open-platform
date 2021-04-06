import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import MailTemplates from '../components/MailTemplateList';

describe('Mail Templates Component', () => {
  it('renders Mail Templates', async () => {
    await act(async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MailTemplates />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.getByTestId('create')).toBeInTheDocument();
    })
  });
});
