const Deploy = {
  "path": window.Deploy.path.replace(/^\/|\/$/g, ""),
  "url": window.Deploy.url,
  "timezone": window.Deploy.timezone,
  "broadcasting": window.Deploy.broadcasting.key,
  "cluster": window.Deploy.broadcasting.cluster,
  "auth": window.Deploy.auth
};

export default Deploy;
