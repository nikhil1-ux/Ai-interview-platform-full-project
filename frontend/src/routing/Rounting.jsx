import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

import ProtectedRoute from "./ProtectedRoute";

import RecruiterDashboard from "../pages/RecruiterDashboard";
import { CandidateDashboard } from "../pages/CandidateDashboard";

import AssignedInterview from "../candidComponents/AssignedInterview";
import Logout from "../candidComponents/Logout";
import Performance from "../candidComponents/Performance";
import Profile from "../candidComponents/Profile";
import Ranking from "../candidComponents/Ranking";
import Resume from "../candidComponents/Resume";
import CreateInterview from "../recruitComponent/CreateInterview";
import RecruiterHome from "../recruitComponent/RecuiterHome";
import CandidateHome from "../candidComponents/CandidateHome";
import { Outlet } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  // 🔐 Protected Routes wrapper
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/candidate-dashboard",
        element: <CandidateDashboard />,
        children: [
          {
          index: true,
          element: <CandidateHome />
            },
          {
           path:"candidatehome",
           element:<CandidateHome/>,
          },

        
          {
            path: "assigned-interviews",
            element: <AssignedInterview />,
          },
          {
            path: "performance",
            element: <Performance />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "ranking",
            element: <Ranking />,
          },
          {
            path: "resume",
            element: <Resume />,
          },
          {
            path: "logout",
            element: <Logout />,
          },
          {
            path: "results",
            element: <Performance />,
          },
        ],
      },

      {
        path: "/recruiter-dashboard",
        element: <RecruiterDashboard />,
        children: [
          {
            index: true,
            element:<RecruiterHome/>
          },
          {
            path:"create-interview",
            element:<CreateInterview/>
          }

        ]
      },
    ],
  },
]);

export default router;