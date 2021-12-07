import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import SplitScreen from "../SplitScreen";

describe('Drawer', () => {
  it('renders drawer component', async () => {
    const container = render(
      <BrowserRouter>
        <SplitScreen open onClose={jest.fn()} logoStyles={{}}>
          <div>Split Screen</div>
        </SplitScreen>
      </BrowserRouter>
    );

    expect(container.queryByTestId('drawer')).toBeInTheDocument();
    expect(container.queryByText('Split Screen')).toBeInTheDocument();
  });
});