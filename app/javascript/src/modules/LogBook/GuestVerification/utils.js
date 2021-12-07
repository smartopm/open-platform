function checkUserInformation(req) {
  const info = req.name || req.email || req.phoneNumber;
  return !!info
}

function checkInfo(req) {
  const info = req.name || req.email || req.phoneNumber || req.imageUrls || req.videoUrl;
  return !!info
}

/**
 * checks if a given step has been completed based on the entry request
 * @param {Object} request
 */
function checkStepStatus(request){
  let status = { basicInfo: false, idCapture: false, videoRecording: false}
 if(!request) return status
 if (request.imageUrls) {
   status = {...status, idCapture: true}
 }
 if (request.videoUrl) {
   status = {...status, videoRecording: true}
 }
 return status
}

export { checkUserInformation,  checkInfo, checkStepStatus }