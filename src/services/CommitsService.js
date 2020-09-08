import config from "../config.json";
import http from "./httpService";

export async function getCommits(owner, repo) {
  const ENDPOINT_URL = config.endpointCommit
    .replace("{1}", owner)
    .replace("{2}", repo);
  const commits = await http.get(ENDPOINT_URL);

  return commits;
}

export async function getCommitStats(owner, repo) {
  const ENDPOINT_URL = config.endpointCommitStats
    .replace("{1}", owner)
    .replace("{2}", repo);

  const commitStats = await http.get(ENDPOINT_URL);
  return commitStats;
}
