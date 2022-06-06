import React from 'react';
import { render, waitFor } from '@testing-library/react';

import AutoSave from '../../shared/AutoSave';

describe('AutoSave component', () => {
  it('trigger auto save after 5 milliseconds', async () => {
    const props = {
      data: 'current value',
      autoSaveAction: jest.fn(),
      delay: 500,
      previous: 'previous value'
    };

    render(<AutoSave {...props} />);

    await waitFor(() => {
      expect(props.autoSaveAction).toHaveBeenCalled();
    }, 1000)
  });

  it('should not trigger auto save if data is unchanged', async () => {
    const props = {
      data: 'current value',
      autoSaveAction: jest.fn(),
      delay: 500,
      previous: 'current value'
    };

    render(<AutoSave {...props} />);

    await waitFor(() => {
      expect(props.autoSaveAction).not.toHaveBeenCalled();
    }, 1000)
  });
});
