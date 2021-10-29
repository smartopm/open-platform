function checkUserInformation(req) {
  const info = req.name || req.email || req.phoneNumber;
  return !!info
}

function checkInfo(req) {
  const info = req.name || req.email || req.phoneNumber || req.imageUrls || req.videoUrl;
  return !!info
}

export { checkUserInformation,  checkInfo }