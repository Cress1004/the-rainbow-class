import React, { Suspense, Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Auth from "../hoc/auth";
import "antd/dist/antd.css";
/** Layouts **/
import LoginLayoutRoute from "./views/Layouts/LoginLayoutRoute";
import DashboardLayoutRoute from "./views/Layouts/DashboardLayoutRoute";
/** Components **/
import UserPage from "./views/User/UserPage/UserPage";
import LoginPage from "./views/User/LoginPage/LoginPage";
import ResetPassword from "./views/User/ResetPassword/ResetPassword";
import Dashboard from "./views/Dashboard/Dashboard";
import ClassList from "./views/Class/ClassList";

class App extends Component {
  render() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <DashboardLayoutRoute 
              path="/users"
              component={Auth(UserPage, null)}
            />
            <DashboardLayoutRoute 
              path="/dashboard"
              component={Auth(Dashboard, null)}
            />
             <DashboardLayoutRoute 
              path="/classes"
              component={Auth(ClassList, null)}
            />
            <LoginLayoutRoute
              path="/login"
              component={Auth(LoginPage, false)}
            />
            <LoginLayoutRoute
              exact
              path="/reset_user"
              component={Auth(ResetPassword, false)}
            />
          </Switch>
        </Suspense>
    );
  }
}

export default App;
