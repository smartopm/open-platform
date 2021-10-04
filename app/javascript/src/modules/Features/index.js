import { objectAccessor } from '../../utils/helpers';

/**
 * Checks if the feature is enabled and returns the passed children
 *
 * @summary This approach is so extensive, we can use it to disable some features in production or in staging
 * currently we have our features like ["fea", "an"], if we change to [{featureName: "fea", enabled: true}] we can simply adjust from here
 * @param {Object} props - The props
 * @param {string[]} props.features - The community features
 * @param {string} props.name - The name of the feature.
 * @param {Node} props.children - The children component to render if this feature is enabled
 */
function FeatureCheck({ features, name, children, subFeature }) {
  if (!features || !name) return null;

  if(subFeature) {
    const subFeatureList = objectAccessor(features, name)?.features || [];
    const isDisabled = new Set(subFeatureList).has(subFeature);

    // Don't render subFeatures contained in the list
    if (isDisabled) {
      return null;
    }

    return children;
  }

  const isEnabled = new Set(Object.keys(features)).has(name);

  if (isEnabled) {
    return children;
  }

  return null;

}

export default FeatureCheck;
