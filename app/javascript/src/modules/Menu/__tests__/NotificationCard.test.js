import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NotificationCard from '../component/NotificationCard';

describe('NotificationCard component', () => {
  const notification = {
    category: 'comment',
    createdAt: '2022-10-10',
    description: 'sample comment',
    header: 'sample header'
  }
  it('should render correctly', () => {
    const container = render(<NotificationCard notification={notification} />);

    expect(container.queryByTestId('card')).toBeInTheDocument();
    expect(container.queryByTestId('date')).toBeInTheDocument();
    expect(container.queryByTestId('header_text')).toHaveTextContent('sample header');
    expect(container.queryByTestId('description_text')).toHaveTextContent('sample comment');
  });
});
