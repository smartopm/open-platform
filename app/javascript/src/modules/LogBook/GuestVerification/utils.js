function checkUserInformation(req) {
  const info = req.name || req.email || req.phoneNumber;
  if (info) {
    return true;
  }
  return false;
}

function checkInfo(req) {
  const info = req.name || req.email || req.phoneNumber || req.imageUrls || req.videoUrl;
  if (info) {
    return true;
  }
  return false;
}

export { checkUserInformation,  checkInfo }