import React from "react";
import "./App.css";
import RepositorySearchForm from "./components/RepositorySearchForm";
import { Switch, Route, Redirect } from "react-router-dom";
import CommitsForm from "./components/CommitsForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <main className="container">
      <ToastContainer />
      <Switch>
        <Route path="/repos" component={RepositorySearchForm}></Route>
        <Route path="/commits/:owner/:repo" component={CommitsForm}></Route>
        <Route path="/commits" component={CommitsForm}></Route>
        <Redirect from="/" to="/repos" exact></Redirect>
      </Switch>
    </main>
  );
}

export default App;
