import React from 'react';
import { render } from '@testing-library/react';

import CustomProgressBar from "../CustomProgressBar";
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

describe('Editable Field component', () => {
  const task = {
    description: 'some description',
    body: 'some body',
    parentNote: { id: '1234', body: 'some parent body' },
    progress: { complete: 2, progress_percentage: 67, total: 3 }
  };

  it('should properly render when large screen', () => {
    const wrapper = render(
      <MockedThemeProvider>
        <CustomProgressBar task={task} smDown={false} />
      </MockedThemeProvider>
    );
    expect(wrapper.queryByTestId('custom_progress_bar')).toBeInTheDocument();
    expect(wrapper.queryByTestId('custom_progress_bar_text')).toBeInTheDocument();
  });

  it('should properly render when small screen', () => {
    const wrapper = render(
      <MockedThemeProvider>
        <CustomProgressBar task={task} smDown />
      </MockedThemeProvider>
    );
    expect(wrapper.queryByTestId('custom_progress_bar_mobile')).toBeInTheDocument();
    expect(wrapper.queryByTestId('custom_progress_bar_text_mobile')).toBeInTheDocument();
  });
});
