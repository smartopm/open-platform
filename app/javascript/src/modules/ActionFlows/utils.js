/**
 * A function that returns assignee ids as string.
 * @param {Object} user
 * @returns String of user ids, separated by comma (,)
 */
function getAssigneeIds(user) {
  return user.map(u => u.id).join(',');
}

export default getAssigneeIds;