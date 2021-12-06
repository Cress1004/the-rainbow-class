import React, { Suspense, Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
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
import VolunteerList from "./views/User/UserPage/Volunteer/VolunteerList";
import AddVolunteer from "./views/User/UserPage/Volunteer/AddVolunteer";
import Mastersetting from "./views/MaterSetting/Mastersetting";
import AddClass from "./views/Class/AddClass";
import ClassDetail from "./views/Class/ClassDetail";
import EditClass from "./views/Class/EditClass";

class App extends Component {
  render() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/">
            <Redirect to="/dashboard" />
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
            exact={true}
            component={Auth(ClassList, null)}
          />
          <DashboardLayoutRoute
            path="/classes/:id"
            exact={true}
            component={Auth(ClassDetail, null)}
          />
            <DashboardLayoutRoute
            path="/classes/:id/edit"
            exact={true}
            component={Auth(EditClass, null)}
          />
          <DashboardLayoutRoute
            path="/add-class"
            component={Auth(AddClass, null)}
          />
          <DashboardLayoutRoute
            path="/add-volunteer"
            component={Auth(AddVolunteer, null)}
          />
          <DashboardLayoutRoute
            path="/volunteers"
            component={Auth(VolunteerList, null)}
          />
          <LoginLayoutRoute path="/login" component={Auth(LoginPage, false)} />
          <LoginLayoutRoute
            exact
            path="/reset_user"
            component={Auth(ResetPassword, false)}
          />
          <DashboardLayoutRoute
            path="/master-setting"
            component={Auth(Mastersetting, null)}
          />
        </Switch>
      </Suspense>
    );
  }
}

export default App;
