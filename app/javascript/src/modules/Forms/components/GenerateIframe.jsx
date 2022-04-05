export default function GenerateIframe(form, hostname) {
  const url = `https://${hostname}/form/${form.id}/public`;

  return `
            <iframe
                src=${url}
                name=${form.name}
                scrolling="auto"
                width="100%"
                height="500px"
            />
        `;
}
