/* eslint-disable import/prefer-default-export */
export function updateStageCount(stages, data) {
  if(!data) return {}
  const updatedStages = {}
    data.projectStages.forEach(([stageName, count]) => {
      updatedStages[stageName.toLowerCase().replace(/\s/g, '_')] = count
    });
    return {...stages, ...updatedStages}
}
