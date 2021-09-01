/* eslint-disable import/prefer-default-export */
/**
 * filters passed quick links by given role
 * @param {[object]} quickLinks
 * @param {string} currentRole
 * @returns {[object]}
 */
export function filterQuickLinksByRole(quickLinks, currentRole) {
  if (quickLinks && currentRole) {
    return quickLinks.filter(link => link.roles && link.roles.includes(currentRole))
  };
  return [{}];
};
