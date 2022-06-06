import React from 'react';
import { render, fireEvent } from '@testing-library/react';

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
      handleButton: jest.fn(),
      menuItems: [{
        content: 'menu topics',
        isAdmin: true,
        handleClick: () => ({})
      }]
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
    expect(rendered.queryByTestId('discussion-menu')).toBeInTheDocument();
    fireEvent.click(rendered.queryByTestId('button'));
    expect(props.handleButton).toHaveBeenCalled();
    fireEvent.click(rendered.queryByTestId('discussion-menu'));
    expect(rendered.queryByTestId('menu_item')).toHaveTextContent('menu topics');
  });
});