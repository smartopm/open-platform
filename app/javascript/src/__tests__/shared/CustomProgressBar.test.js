import React from 'react';
import { render } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import '@testing-library/jest-dom/extend-expect';
import CustomProgressBar from '../../shared/CustomProgressBar';

describe('Editable Field component', () => {

  const theme = createTheme();
  const task = {
      description: 'some description',
      body: 'some body',
      parentNote: { id: '1234', body: 'some parent body' },
      progress: { complete: 2, progress_percentage: 67, total: 3 }
  };

  
  it('should properly render when large screen', () => {
    const wrapper = render(
      <ThemeProvider theme={theme}>
        <CustomProgressBar task={task} smDown={false} />
      </ThemeProvider>);
    expect(wrapper.queryByTestId('custom_progress_bar')).toBeInTheDocument();
    expect(wrapper.queryByTestId('custom_progress_bar_text')).toBeInTheDocument();
  });


  it('should properly render when small screen', () => {
    const wrapper = render(
      <ThemeProvider theme={theme}>
        <CustomProgressBar task={task} smDown />
      </ThemeProvider>);
    expect(wrapper.queryByTestId('custom_progress_bar_mobile')).toBeInTheDocument();
    expect(wrapper.queryByTestId('custom_progress_bar_text_mobile')).toBeInTheDocument();
  });
});
