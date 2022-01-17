export default function hrefsExtractor(link) {
  const doc = document.createElement('html');
  doc.innerHTML = link;
  const links = doc.getElementsByTagName('a');
  const urls = [];

  Object.values(links).forEach(l => urls.push(l.getAttribute('href')));

  return urls;
}
