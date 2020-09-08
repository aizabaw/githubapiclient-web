import React, { Component } from "react";
import { getCommits, getCommitStats } from "./../services/CommitsService";
import Chart from "chart.js";
import { Link } from "react-router-dom";

class CommitsForm extends Component {
  state = {
    owner: "",
    repo: "",
    commits: [],
    averageWeeklyCommit: "",
    commitCountLastWeek: 0,
    commitCountTwoWeeksAgo: 0,
    commitCountThreeWeeksAgo: 0,
    totalCommits: 0,
  };

  chartRef = React.createRef();
  chartRef2 = React.createRef();

  async componentDidMount() {
    const { owner, repo } = this.props.match.params;
    const { data } = await getCommits(owner, repo);
    const { commits, totalCommits } = data;
    this.setState({ commits, owner, repo, totalCommits });

    const { data: stats } = await getCommitStats(owner, repo);

    const {
      commitCountLastWeek,
      commitCountTwoWeeksAgo,
      commitCountThreeWeeksAgo,
    } = stats;

    const averageWeeklyCommit = Math.floor(
      (commitCountLastWeek +
        commitCountTwoWeeksAgo +
        commitCountThreeWeeksAgo) /
        3
    );

    this.setState({
      averageWeeklyCommit,
      commitCountLastWeek,
      commitCountTwoWeeksAgo,
      commitCountThreeWeeksAgo,
    });

    if (
      commitCountLastWeek > 0 ||
      commitCountTwoWeeksAgo > 0 ||
      commitCountThreeWeeksAgo > 0
    ) {
      const myChartRef = this.chartRef.current.getContext("2d");
      new Chart(myChartRef, {
        type: "line",
        data: {
          //Bring in data
          labels: ["Three Weeks Ago", "Two Weeks Ago", "Last Week"],
          datasets: [
            {
              label: "Commits",
              data: [
                commitCountThreeWeeksAgo,
                commitCountTwoWeeksAgo,
                commitCountLastWeek,
              ],
            },
          ],
        },
        options: {
          //Customize chart options
        },
      });

      const myCommitProjectionChart = this.chartRef2.current.getContext("2d");
      new Chart(myCommitProjectionChart, {
        type: "line",
        data: {
          //Bring in data
          labels: [
            "Three Weeks Ago",
            "Two Weeks Ago",
            "Last Week",
            "Next Week",
            "+2 weeks",
            "+3 weeks",
            "+4 weeks",
          ],
          datasets: [
            {
              label: "Commits",
              data: [
                commitCountThreeWeeksAgo,
                commitCountTwoWeeksAgo,
                commitCountLastWeek,
                commitCountLastWeek + averageWeeklyCommit,
                commitCountLastWeek + averageWeeklyCommit * 2,
                commitCountLastWeek + averageWeeklyCommit * 3,
                commitCountLastWeek + averageWeeklyCommit * 4,
              ],
            },
          ],
        },
        options: {
          //Customize chart options
        },
      });
    }
  }

  render() {
    const {
      commits,
      repo,
      averageWeeklyCommit,
      commitCountLastWeek,
      commitCountTwoWeeksAgo,
      commitCountThreeWeeksAgo,
      totalCommits,
    } = this.state;

    return (
      <div>
        <div className="mt-2">
          <Link to="/">Back to homepage</Link>
        </div>
        <div className="mt-3">
          <h1>Commits for repository '{repo}'</h1>
        </div>

        <div className="font-weight-bold font-italic text-left mt-2">
          Found {totalCommits} commit(s)
        </div>

        <div className="mt-5">
          <h5>Committers</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Email</th>
                <th>Impact Based on Latest 100 Commits</th>
              </tr>
            </thead>
            <tbody>
              {commits &&
                commits.map((commit) => (
                  <tr key={commit.name}>
                    <td>{commit.name}</td>
                    <td>{commit.email}</td>
                    <td>{commit.commitCount} commits</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5">
          {(commitCountLastWeek > 0 ||
            commitCountTwoWeeksAgo > 0 ||
            commitCountThreeWeeksAgo > 0) && (
            <div>
              <div>
                <div>
                  <h5>Commits in the past 3 weeks</h5>
                </div>
                <canvas id="myChart" ref={this.chartRef} />
              </div>
              <div className="mt-5">
                <h5>Projected commits for the next 4 weeks</h5>
                <h8 className="font-italic">
                  Based on current average of {averageWeeklyCommit} commits per
                  week
                </h8>
                <canvas id="myChart2" ref={this.chartRef2} />
              </div>
            </div>
          )}

          {commitCountLastWeek === 0 &&
            commitCountTwoWeeksAgo === 0 &&
            commitCountThreeWeeksAgo === 0 && (
              <div>
                <div className="font-italic font-weight-bold">
                  This project has been inactive in the past 3 weeks
                </div>
                <div className="font-italic font-weight-bold">
                  Unable to determine projections due to lack of recent data
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default CommitsForm;
