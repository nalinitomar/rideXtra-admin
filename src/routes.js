// src/routes.js
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import UserProfile from "layouts/userProfile";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import ProtectedRoute from "./protecter";
import ContentManagement from "layouts/Contentmanagement";

// @mui icons
import Icon from "@mui/material/Icon";
import Driver from "layouts/driver";
import DriverProfile from "layouts/driverProfile";
import DriverHistory from "layouts/driverHistory";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "User Management",
    key: "users",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/users",
    component: (
      <ProtectedRoute>
        <Tables />
      </ProtectedRoute>
    ),
  },
  {
    // 👇 Hidden route (not in sidenav)
    key: "user-profile",
    route: "/users/profile/:id",
    component: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    // 👇 Hidden route (not in sidenav)
    key: "driver-profile",
    route: "/drivers/profile/:id",
    component: (
      <ProtectedRoute>
        <DriverProfile />
      </ProtectedRoute>
    ),
  },
  {
    // 👇 Hidden route (not in sidenav)
    key: "driver-history",
    route: "/drivers/history/:id",
    component: (
      <ProtectedRoute>
        <DriverHistory />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Driver Management",
    key: "driver",
    icon: <Icon fontSize="small">work</Icon>,
    route: "/driver",
    component: (
      <ProtectedRoute>
        <Driver />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Content Management",
    key: "content",
    icon: <Icon fontSize="small">article</Icon>,
    route: "/content",
    component: (
      <ProtectedRoute>
        <ContentManagement />
      </ProtectedRoute>
    ),
  },
  {
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

export default routes;
