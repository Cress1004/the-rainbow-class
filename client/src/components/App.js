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
import AdminList from "./views/User/UserPage/Admin/AdminList";
import SetMonitor from "./views/Class/Session/SetMonitor";
import CommentStudent from "./views/Class/CommentStudent/CommentStudent";
import HomePageLayoutRoute from "./views/Layouts/HomePageLayoutRoute";
import UploadCV from "./views/HomePage/UploadCV";
import CVList from "./views/CV/CVList";
import CVDetail from "./views/CV/CVDetail";

function App(props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>
        <HomePageLayoutRoute
          path="/upload-cv"
          component={Auth(UploadCV, false)}
        />
        <DashboardLayoutRoute
          path="/dashboard"
          exact={true}
          component={Auth(Dashboard, true)}
        />
        <DashboardLayoutRoute
          path="/profile"
          exact={true}
          component={Auth(Profile, true)}
        />
        <DashboardLayoutRoute
          path="/profile/edit"
          exact={true}
          component={Auth(EditProfile, true)}
        />
        <DashboardLayoutRoute path="/users" component={Auth(UserPage, true)} />
        <DashboardLayoutRoute
          path="/schedules"
          component={Auth(ClassSchedule, true)}
        />
        <DashboardLayoutRoute
          path="/classes"
          exact={true}
          component={Auth(ClassList, true)}
        />
        <DashboardLayoutRoute
          path="/classes/:id"
          exact={true}
          component={Auth(ClassDetail, true)}
        />
        <DashboardLayoutRoute
          path="/classes/:id/lessons/add"
          exact={true}
          component={Auth(AddLesson, true)}
        />
        <DashboardLayoutRoute
          path="/classes/:id/lessons/:lessonId"
          exact={true}
          component={Auth(LessonDetail, true)}
        />
        <DashboardLayoutRoute
          path="/classes/:id/lessons/:lessonId/edit"
          exact={true}
          component={Auth(EditLesson, true)}
        />
        <DashboardLayoutRoute
          path="/classes/:id/edit"
          exact={true}
          component={Auth(EditClass, true)}
        />
        <DashboardLayoutRoute
          path="/classes/:id/set-monitor"
          exact={true}
          component={Auth(SetMonitor, true)}
        />
        <DashboardLayoutRoute
          path="/classes/:id/comment-student"
          exact={true}
          component={Auth(CommentStudent, true)}
        />
        <DashboardLayoutRoute
          path="/add-class"
          component={Auth(AddClass, true)}
        />
        <DashboardLayoutRoute path="/admin" component={Auth(AdminList, true)} />
        <DashboardLayoutRoute
          path="/add-volunteer"
          component={Auth(AddVolunteer, true)}
        />
        <DashboardLayoutRoute
          path="/volunteers"
          exact={true}
          component={Auth(VolunteerList, true)}
        />
        <DashboardLayoutRoute
          path="/volunteers/:id"
          exact={true}
          component={Auth(VolunteerDetail, true)}
        />
        <DashboardLayoutRoute
          path="/volunteers/:id/edit"
          exact={true}
          component={Auth(EditVolunteer, true)}
        />
        <DashboardLayoutRoute
          path="/add-student"
          component={Auth(AddStudent, true)}
        />
        <DashboardLayoutRoute
          path="/students"
          exact={true}
          component={Auth(StudentList, true)}
        />
        <DashboardLayoutRoute
          path="/students/:id"
          exact={true}
          component={Auth(StudentDetail, true)}
        />
        <DashboardLayoutRoute
          path="/students/:id/edit"
          exact={true}
          component={Auth(EditStudent, true)}
        />
        <DashboardLayoutRoute
          path="/cv"
          exact={true}
          component={Auth(CVList, true)}
        />
         <DashboardLayoutRoute
          path="/cv/:id"
          exact={true}
          component={Auth(CVDetail, true)}
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
          component={Auth(Mastersetting, true)}
        />
      </Switch>
    </Suspense>
  );
}

export default App;
