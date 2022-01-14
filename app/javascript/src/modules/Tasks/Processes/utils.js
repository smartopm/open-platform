/* eslint-disable import/prefer-default-export */
export function updateStageCount(stages, data) {
  if(!data) return {}
  const updatedStages = {}
    data.projectStages.forEach(([stageName, count]) => {
      updatedStages[stageName.toLowerCase().replace(/\s/g, '_')] = count
    });
    return {...stages, ...updatedStages}
}

export function filterProjectAndStages(projectData){
  if (!projectData) return [];

  if(!Array.isArray(projectData) && projectData.length < 0) {
    return [];
  }

  return projectData.map((project) => ({
    ...project,
    subTasks: project.subTasks,
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
      const key = currentStage.toLowerCase().replace(/\s/g, '_')
      lookup[String(key)] += 1;
    }
  });

  return lookup;
}

