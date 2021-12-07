import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeatureCheck, { featureCheckHelper } from '..';

describe('Feature Check component', () => {
  const features = { Any: { features: ['Any SubFeature'] }, Payments: { features: [] } };
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

  it('should check if the features and name is undefined', () => {
    const wrapper = render(
      <FeatureCheck>
        <h4>This is our new feature</h4>
      </FeatureCheck>
    );
    expect(wrapper.queryByText('This is our new feature')).not.toBeInTheDocument();
  });

  it('should check if a sub feature is disabled', () => {
    const wrapper = render(
      <FeatureCheck features={features} name="Any" subFeature="Any SubFeature">
        <h4>This is a sub feature of a module</h4>
      </FeatureCheck>
    );
    expect(wrapper.queryByText('This is a sub feature of a module')).not.toBeInTheDocument();
  });

  it('should check if a sub feature is enabled', () => {
    features.Any.features = [];
    const wrapper = render(
      <FeatureCheck features={features} name="Any" subFeature="Any SubFeature">
        <h4>This is a sub feature of a module</h4>
      </FeatureCheck>
    );
    expect(wrapper.queryByText('This is a sub feature of a module')).toBeInTheDocument();
  });

  it('should check if a sub feature is enabled using the helper', () => {
    const anyFeatures = { Any: { features: [''] }, Payments: { features: [] } };
    const isVisible = featureCheckHelper(anyFeatures, 'Any', 'Any SubFeature')
    expect(isVisible).toBe(true);
  });
  it('should check if a sub feature is disabled using the helper', () => {
    const anyFeatures = { Any: { features: ['Any SubFeature'] }, Payments: { features: [] } };
    const isVisible = featureCheckHelper(anyFeatures, 'Any', 'Any SubFeature')
    expect(isVisible).toBe(false);
  });
});
