import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom';
import { render, waitFor } from '@testing-library/react';

import TaskPageRedirect from '../Components/TaskPageRedirect';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({ taskId: '88b78aeb-6aee-4b0e-948f-8098e3d5b690' })
}));

describe('Task Page Redirect', () => {
  it('redirects to task details page', async () => {
    render(
      <BrowserRouter>
        <TaskPageRedirect />
      </BrowserRouter>
    );

    await waitFor(() => {
     expect(window.location.pathname).toEqual('/tasks');
    });
  });
});
