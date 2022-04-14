import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { useTranslation } from 'react-i18next';
import FormMenu from '../components/FormMenu';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('TextInput component', () => {
  it('should not break the text input', () => {
  const { t } = useTranslation(['common', 'form']);
    const props = {
      handleClose: jest.fn(),
      formId: 'sjhef3042432',
      anchorEl: document.createElement("button"),
      open: true,
      refetch: jest.fn(),
      formName: 'sexample',
      t
    };
    const rendered = render(
      <BrowserRouter>
        <MockedProvider mocks={[]}>
          <MockedThemeProvider>
            <FormMenu {...props} />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );
    expect(rendered.queryByText('common:menu.edit')).toBeInTheDocument();
    expect(rendered.queryByText('common:menu.publish')).toBeInTheDocument();
    expect(rendered.queryByText('common:menu.delete')).toBeInTheDocument();
    fireEvent.click(rendered.queryByText('common:menu.publish'));
    expect(props.handleClose).toBeCalled();
  });
});
