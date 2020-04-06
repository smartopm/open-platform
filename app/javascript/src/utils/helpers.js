export function findLinkAndReplace(msg) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return msg.replace(urlRegex, function(url) {
        return `<a href="${url}">${url}</a>`
    })
}

export function truncateString(message) {
  if (!message) return
  if (message.length <= 40) return message
  return `${message.substring(0, 40)}...`
}