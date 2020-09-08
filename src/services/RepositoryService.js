import config from "../config.json";
import axios from "axios";

export async function searchRepo(
  name,
  description,
  readme,
  owner,
  size,
  currentPage
) {
  let apiEndpoint = config.endpointRepos;

  if (name !== null) apiEndpoint += "?name=" + name;

  if (description != null) apiEndpoint += "&description=" + description;

  if (readme != null) apiEndpoint += "&readme=" + readme;

  if (owner != null) apiEndpoint += "&owner=" + owner;

  apiEndpoint += "&size=" + size;
  apiEndpoint += "&page=" + currentPage;

  const { data: p } = await axios.get(apiEndpoint);

  return p;
}
