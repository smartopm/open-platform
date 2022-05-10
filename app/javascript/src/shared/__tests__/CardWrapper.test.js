import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import CardWrapper from '../CardWrapper';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

describe('CardWrapper component', () => {
  it('should render without error', () => {
    const props = {
      children: <div>sampleText</div>,
      title: 'sample title',
      buttonName: 'sample button name',
      displayButton: true,
      handleButton: jest.fn()
    };
    const rendered = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <MockedProvider>
            <CardWrapper {...props} />
          </MockedProvider>
        </MockedThemeProvider>
      </BrowserRouter>
    );

    expect(rendered.queryByText('sample title')).toBeInTheDocument();
    expect(rendered.queryByTestId('button')).toHaveTextContent('sample button name');
    fireEvent.click(rendered.queryByTestId('button'));
    expect(props.handleButton).toHaveBeenCalled();
  });
});