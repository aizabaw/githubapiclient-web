import React, { Component } from "react";
import { searchRepo } from "../services/RepositoryService";
import _ from "lodash";
import Input from "../common/Input";
import config from "../config.json";
import { Link } from "react-router-dom";
import Joi from "joi-browser";

class RepositorySearchForm extends Component {
  state = {
    data: {
      name: "",
    },
    itemsPerPage: 10,
    repos: [],
    totalResult: -1,
    currentPage: 1,
    totalPages: 0,
    pageDisplayCount: 5,
    errors: {},
  };

  schema = { name: Joi.string().required().label("search keyword") };

  handeSubmit = async (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    const { repositories, totalCount } = await this.search();

    //calculate no. of pages based on result count
    const totalPages = Math.ceil(totalCount / this.state.itemsPerPage);

    this.setState({ repos: repositories, totalResult: totalCount, totalPages });
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    if (error) return error.details[0].message;
    else return null;
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleClickPage = async (page) => {
    const { repositories } = await this.search(page);
    this.setState({ repos: repositories, currentPage: page });
  };

  async search(page) {
    const { name, description, readme, owner } = this.state.data;
    const { itemsPerPage } = this.state;

    if (page == null) page = 1;

    const p = await searchRepo(
      name,
      description,
      readme,
      owner,
      itemsPerPage,
      page
    );

    return p;
  }

  cropUrl(url) {
    const cropped =
      url.length <= config.urlDisplayLength
        ? url
        : url.substring(0, config.urlDisplayLength) + "...";
    return cropped;
  }

  render() {
    const {
      repos,
      totalResult,
      currentPage,
      totalPages,
      pageDisplayCount,
      errors,
    } = this.state;

    let pages;
    let start = 1;
    let end = 1;
    if (totalPages > 1) {
      //limit page display to 'pageDisplayCount', default 5
      //if currentPage is not in the middle
      if (totalPages > pageDisplayCount) {
        start = currentPage - Math.floor(pageDisplayCount / 2);
      }

      start = start <= 0 ? 1 : start;
      end =
        start + (totalPages > pageDisplayCount ? pageDisplayCount : totalPages);
      pages = _.range(start, end);
    }

    return (
      <div>
        <div>
          <h1 className="mt-5">Repositories</h1>
        </div>
        <form onSubmit={this.handeSubmit}>
          <div className="row mb-2 mt-3">
            <div className="col-sm-8">
              <Input
                name="name"
                label="Enter keyword"
                onChange={this.handleChange}
                errors={errors["name"]}
                helpText="Keyword will be searched in names, descriptions and readme contents of repositories"
              />
            </div>
          </div>
          <div className="row mb-5" style={{ marginBotton: 20 }}>
            <div className="col-sm">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.handeSubmit}
              >
                Search
              </button>
            </div>
          </div>

          {totalResult === 0 && (
            <div>
              <h5>No match found</h5>
            </div>
          )}
          {totalResult === 1 && (
            <div>
              <label>Found {totalResult} repository</label>
            </div>
          )}
          {totalResult > 1 && (
            <div>
              <label>Found {totalResult} repositories</label>
            </div>
          )}

          {totalResult > 0 && (
            <div>
              <table className="table">
                <thead className="thead-light">
                  <tr>
                    <th>Name</th>
                    <th>URL</th>
                    <th>Commits</th>
                    <th>Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {repos.map((repo) => (
                    <tr key={repo.id}>
                      <td>{repo.name}</td>
                      <td>{this.cropUrl(repo.url)}</td>
                      <td>
                        <Link to={`/commits/${repo.owner.login}/${repo.name}`}>
                          {this.cropUrl(repo.commitsUrl)}
                        </Link>
                      </td>
                      <td>{repo.owner.login}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <nav>
            <ul className="pagination justify-content-end">
              {start > 1 && (
                <li className="page-item">
                  <button
                    type="submit"
                    className="page-link"
                    onClick={() =>
                      this.handleClickPage(this.state.currentPage - 1)
                    }
                  >
                    Previous
                  </button>
                </li>
              )}
              {totalPages > 1 &&
                pages.map((page) => (
                  <li
                    key={page}
                    className={
                      page === currentPage ? "page-item active" : "page-item"
                    }
                  >
                    <button
                      type="submit"
                      className="page-link"
                      onClick={() => this.handleClickPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
              {end < totalPages && (
                <li className="page-item">
                  <button
                    type="submit"
                    className="page-link"
                    onClick={() =>
                      this.handleClickPage(this.state.currentPage + 1)
                    }
                  >
                    Next
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </form>
      </div>
    );
  }
}
export default RepositorySearchForm;
