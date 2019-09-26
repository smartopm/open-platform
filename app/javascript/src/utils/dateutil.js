function dateFromISO8601(isostr) {
    var parts = isostr.match(/\d+/g);
    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
}

export default {
  fromISO8601: dateFromISO8601,
}
