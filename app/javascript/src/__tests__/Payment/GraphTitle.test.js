import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GraphTitle from '../../shared/GraphTitle';

describe('It should test the graph title component', () => {
  it('it should render Graph Title', () => {
    const container = render(<GraphTitle title="Heading" />);
    expect(container.queryByText('Heading')).toBeInTheDocument();
  });
});
