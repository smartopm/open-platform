import React from 'react';
import { render } from '@testing-library/react';
import IframeContainer from '../components/IframeContainer';

describe('iframe container component', () => {
  const props = {
    link: 'https://app.doublegdp.com/',
    height: 200,
    width: 345
  };
  const iframe = render(<IframeContainer {...props} />);
  it('renders correctly', () => {
    expect(iframe.queryByTestId('iframe')).toBeInTheDocument();
  });
});
