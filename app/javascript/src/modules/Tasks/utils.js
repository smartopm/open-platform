/* eslint-disable import/prefer-default-export */
export function taskTitleContent(taskBody, projectDeveloper, error) {
  if (taskBody.toLowerCase().includes('DRC Project Review Process'.toLowerCase()) && projectDeveloper.value && !error) {
    return projectDeveloper.value;
  }
  return taskBody;
}
