import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';

import Discuss from '../Components/Discuss';

describe('Discuss form component', () => {
  it('should render with wrong props', () => {
    const container = render(
      <MockedProvider>
        <Discuss update={jest.fn()} />
      </MockedProvider>
    );
    expect(container.queryByText('form_actions.submit')).toBeInTheDocument();

    const title = container.queryByLabelText('discuss_title');
    fireEvent.change(title, { target: { value: 'This is a title' } });
    expect(title.value).toBe('This is a title');

    const description = container.queryByLabelText('discuss_description');
    fireEvent.change(description, { target: { value: 'This is a description of the discussion' } });
    expect(description.value).toBe('This is a description of the discussion');
  });
});
