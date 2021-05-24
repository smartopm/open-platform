import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeatureCheck from '..';

describe('Feature Check component', () => {
  const features = ['Payments', 'News', 'Any'];
  it('should check if the feature is enabled', () => {
    const wrapper = render(
      <FeatureCheck features={features} name="Any">
        <h4>This is our new feature</h4>
      </FeatureCheck>
    );
    expect(wrapper.queryByText('This is our new feature')).toBeInTheDocument();
  });

  it('should check if the feature is disabled', () => {
    const wrapper = render(
      <FeatureCheck features={features} name="SomethingElseWeDontKnow">
        <h4>This is our new feature</h4>
      </FeatureCheck>
    );
    expect(wrapper.queryByText('This is our new feature')).not.toBeInTheDocument();
  });
});
