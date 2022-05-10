/* eslint-disable security/detect-object-injection */
/* eslint-disable no-param-reassign */
import { toTitleCase } from "../../../utils/helpers";

export function hrefsExtractor(link) {
  const doc = document.createElement('html');
  doc.innerHTML = link;
  const links = doc.getElementsByTagName('a');
  const urls = [];

  Object.values(links).forEach(l => urls.push(l.getAttribute('href')));

  return urls;
}

export function getFormUrl(formId) {
  return `${window.location.origin}/form/${formId}/private`
}

export function filterProjectAndStages(projectData, projectStages){
  if (!projectData) return [];

  if(!Array.isArray(projectData) && projectData.length < 0) {
    return [];
  }

  return projectData.map((project) => ({
    ...project,
    subTasks: project.subTasks.filter(
      (subTask) => (Object.keys(projectStages).includes(sentenceToSnakeCase(subTask.body)))
      ),
  }))
}

function getCurrentStage(project){
 return project.subTasks.find((subTask) => !subTask.completed)?.body
}

export function calculateOpenProjectsByStage(projects, stages){
  const lookup = stages;

  if (!projects) return lookup;

  if (!Array.isArray(projects) || projects.length < 0) return lookup;

  projects.forEach((project) => {
    const currentStage = getCurrentStage(project)

    if(currentStage) {
      const key = sentenceToSnakeCase(currentStage)
      lookup[String(key)] += 1;
    }
  });

  return lookup;
}

export function sentenceToSnakeCase(text) {
  if (!text) return null;
  return text.toLowerCase().replace(/\s/g, '_');
}

export function snakeCaseToSentence(text){
  if (!text) return null;
  const plainText = text.replace(/_/g, ' ')
  return toTitleCase(plainText)
}

export function groupComments(comments){
  return comments.reduce((result, comment) => {
    const groupedId = comment.groupingId || 'no-group'
    result[groupedId] = [...(result[groupedId] || []), comment];
    return result;
  }, {});
}

export function lastRepliedComment(groupedComments, groupingId) {
  const commentsInGroup = groupedComments[groupingId]
  return commentsInGroup[commentsInGroup.length - 1]
}

export function isDiscussionResolved(groupedComments, groupingId) {
  const comments = groupedComments[groupingId]
  if (!comments.filter((com) => !com.repliedAt).length) {
    return true
  }
  return false
}

export function checkLastItem(index, arr) {
  return index === arr.length - 1;
}

/**
 * return only menu items that should be visible to current user
 * @param {[object]} menus
 * @returns []
 */
 export function accessibleMenus(menus){
  if(!menus || !menus.length) return []
  return menus.filter(menu => menu.isVisible)
}

export function sortRepliesRequestedComments(comments) {
  if (!comments) return null;
  return comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
