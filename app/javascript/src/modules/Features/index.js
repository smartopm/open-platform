import PropTypes from 'prop-types'
import { objectAccessor } from '../../utils/helpers';

/**
 * Checks if the feature is enabled and returns the passed children
 *
 * @summary This approach is so extensive, we can use it to disable some features in production or in staging
 * currently we have our features like ["fea", "an"], if we change to [{featureName: "fea", enabled: true}]
 * we can simply adjust from here
 * @param {Object} props - The props
 * @param {string[]} props.features - The community features
 * @param {string} props.name - The name of the feature.
 * @param {Node} props.children - The children component to render if this feature is enabled
 */
function FeatureCheck({ features, name, children, subFeature }) {
  if (!features || !name) return null;
  const visible = featureCheckHelper(features, name, subFeature)
  if(!visible) {
    return null
  }
  return children
}

/**
 * Check if a feature is enabled and if its subfeature is not disabled
 * @param {Object} features List of features for the current community
 * @param {string} name The main feature we want to check for
 * @param {string} subFeature The small part of the main feature
 * @returns {boolean} true if enabled and false otherwise
 */
export function featureCheckHelper(features, name, subFeature) {
  const subFeatureList = objectAccessor(features, name)?.features || [];
  const isSubFeatureDisabled = subFeature ? new Set(subFeatureList).has(subFeature) : false ;
  const isFeatureEnabled = new Set(Object.keys(features)).has(name);
  if(isFeatureEnabled && !isSubFeatureDisabled) {
    return true
  }
  return false
}

FeatureCheck.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  features: PropTypes.object,
  name: PropTypes.string,
  children: PropTypes.node.isRequired,
  subFeature:  PropTypes.string,
}

export default FeatureCheck;


