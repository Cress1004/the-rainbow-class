import React, { Suspense } from "react";
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
import Dashboard from "./views/Schedule/Dashboard/Dashboard";
import ClassList from "./views/Class/ClassList";
import VolunteerList from "./views/User/UserPage/Volunteer/VolunteerList";
import AddVolunteer from "./views/User/UserPage/Volunteer/AddVolunteer";
import Mastersetting from "./views/MaterSetting/Mastersetting";
import AddClass from "./views/Class/AddClass";
import ClassDetail from "./views/Class/ClassDetail";
import EditClass from "./views/Class/EditClass";
import VolunteerDetail from "./views/User/UserPage/Volunteer/VolunteerDetail";
import EditVolunteer from "./views/User/UserPage/Volunteer/EditVolunteer";
import AddStudent from "./views/User/UserPage/Student/AddStudent";
import StudentList from "./views/User/UserPage/Student/StudentList";
import EditStudent from "./views/User/UserPage/Student/EditStudent";
import StudentDetail from "./views/User/UserPage/Student/StudentDetail";
import Profile from "./views/User/Profile/Profile";
import EditProfile from "./views/User/Profile/EditProfile";
import AddLesson from "./views/Class/Lesson/AddLesson";
import LessonDetail from "./views/Class/Lesson/LessonDetail";
import EditLesson from "./views/Class/Lesson/EditLesson";
import ClassSchedule from "./views/Schedule/ClassSchedule/ClassSchedule";

function App(props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>
        <DashboardLayoutRoute
          path="/dashboard"
          exact={true}
          component={Auth(Dashboard, null)}
        />
        <DashboardLayoutRoute
          path="/profile"
          exact={true}
          component={Auth(Profile, null)}
        />
        <DashboardLayoutRoute
          path="/profile/edit"
          exact={true}
          component={Auth(EditProfile, null)}
        />
        <DashboardLayoutRoute path="/users" component={Auth(UserPage, null)} />
        <DashboardLayoutRoute
          path="/schedules"
          component={Auth(ClassSchedule, null)}
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
          path="/classes/:id/lessons/add"
          exact={true}
          component={Auth(AddLesson, null)}
        />
        <DashboardLayoutRoute
          path="/classes/:id/lessons/:lessonId"
          exact={true}
          component={Auth(LessonDetail, null)}
        />
        <DashboardLayoutRoute
          path="/classes/:id/lessons/:lessonId/edit"
          exact={true}
          component={Auth(EditLesson, null)}
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
          exact={true}
          component={Auth(VolunteerList, null)}
        />
        <DashboardLayoutRoute
          path="/volunteers/:id"
          exact={true}
          component={Auth(VolunteerDetail, null)}
        />
        <DashboardLayoutRoute
          path="/volunteers/:id/edit"
          exact={true}
          component={Auth(EditVolunteer, null)}
        />
        <DashboardLayoutRoute
          path="/add-student"
          component={Auth(AddStudent, null)}
        />
        <DashboardLayoutRoute
          path="/students"
          exact={true}
          component={Auth(StudentList, null)}
        />
        <DashboardLayoutRoute
          path="/students/:id"
          exact={true}
          component={Auth(StudentDetail, null)}
        />
        <DashboardLayoutRoute
          path="/students/:id/edit"
          exact={true}
          component={Auth(EditStudent, null)}
        />
        <LoginLayoutRoute
          exact
          path="/login"
          component={Auth(LoginPage, false)}
        />
        <LoginLayoutRoute
          exact
          path="/reset-password"
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

export default App;
