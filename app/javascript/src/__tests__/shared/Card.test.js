import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import Card from '../../shared/Card';

describe('Card', () => {
  it('should render the Card Component', () => {
    const clickdata = {
      clickable: true,
      handleClick: jest.fn()
    }
    const card = render(
      <Card clickData={clickdata}>
        Hello
        {' '}
      </Card>);
    expect(card.queryByTestId('card')).toBeInTheDocument();
    fireEvent.click(card.queryByTestId('card'))
    expect(clickdata.handleClick).toBeCalled()
  });
});
