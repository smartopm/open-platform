import React from 'react';

import { render } from '@testing-library/react';
import ProgressBar from "../ProgressBar";

describe('ProgressBar', () => {
  it('should render not render the progress bar when status is INIT', () => {
    const contaner = render(<ProgressBar status="INIT" />);
    expect(contaner.queryByTestId('progress')).not.toBeInTheDocument();
  });

  it('should render render the progress bar when status is FILE_RESIZE', () => {
    const contaner = render(<ProgressBar status="FILE_RESIZE" />);
    expect(contaner.queryByTestId('progress')).toBeInTheDocument();
  });

  it('should render render the progress bar when status is FILE_CHECKSUM', () => {
    const contaner = render(<ProgressBar status="FILE_CHECKSUM" />);
    expect(contaner.queryByTestId('progress')).toBeInTheDocument();
  });

  it('should render render the progress bar when status is FILE_META_UPLOAD', () => {
    const contaner = render(<ProgressBar status="FILE_META_UPLOAD" />);
    expect(contaner.queryByTestId('progress')).toBeInTheDocument();
  });

  it('should render render the progress bar when status is FILE_UPLOAD', () => {
    const contaner = render(<ProgressBar status="FILE_UPLOAD" />);
    expect(contaner.queryByTestId('progress')).toBeInTheDocument();
  });

  it('should render not render the progress bar when status is DONE', () => {
    const contaner = render(<ProgressBar status="DONE" />);
    expect(contaner.queryByTestId('progress')).not.toBeInTheDocument();
  });
});
