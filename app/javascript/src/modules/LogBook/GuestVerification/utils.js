// TODO: check by required field per community
function checkUserInformation(req) {
  const info = req.name || req.email || req.phoneNumber;
  return !!info
}

function checkInfo(req) {
  const info = checkUserInformation(req) || req.imageUrls || req.videoUrl;
  return !!info
}

/**
 * Checks if all verification steps are completed
 * @param {Object} request The entry we are checking aganst
 * @returns true if all steps have been completed and false otherwise
 */
function validateAllSteps(request){
  if(!request) return false
  const status = checkStepStatus(request)
  return status.basicInfo && status.idCapture && status.videoRecording
}

/**
 * checks if a given step has been completed based on the entry request
 * @param {Object} request request The entry we are checking aganst
 * @return {{ basicInfo: boolean, idCapture: boolean, videoRecording: boolean}}
 */
function checkStepStatus(request){
  let status = { basicInfo: false, idCapture: false, videoRecording: false}
 if(!request) return status
 if (checkUserInformation(request)) {
   status = {...status, basicInfo: true}
 }
 if (request.imageUrls && request.imageUrls.length === 2) {
   status = {...status, idCapture: true}
 }
 if (request.videoUrl) {
   status = {...status, videoRecording: true}
 }
 return status
}

export { checkUserInformation,  checkInfo, checkStepStatus, validateAllSteps }