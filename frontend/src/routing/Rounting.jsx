import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

import ProtectedRoute from "./ProtectedRoute";

import RecruiterDashboard from "../pages/RecruiterDashboard";
import { CandidateDashboard } from "../pages/CandidateDashboard";

import AssignedInterview from "../candidComponents/AssignedInterview.jsx";
import Logout from "../candidComponents/Logout.jsx";
import Performance from "../candidComponents/Performance.jsx";
import Profile from "../candidComponents/Profile.jsx";
import Ranking from "../candidComponents/Ranking.jsx";
import Resume from "../candidComponents/Resume.jsx";
import CreateInterview from "../recruitComponent/CreateInterviews.jsx";
import RecruiterHome from "../recruitComponent/RecuiterHome.jsx";
import ManageInterviews from "../recruitComponent/ManageInterviews.jsx";
import Candidates from "../recruitComponent/Candidates.jsx";
import Results from "../recruitComponent/Results.jsx";
import CandidateHome from "../candidComponents/CandidateHome.jsx";
import { Outlet } from "react-router-dom";
import InterviewRoom from "../candidComponents/InterviewRoom.jsx";

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
          },
          {
            path: "manage-interviews",
            element: <ManageInterviews />,
          },
          {
            path: "candidates",
            element: <Candidates />,
          },
          {
            path: "results",
            element: <Results />,
          },
          {
            path: "Logout",
            element: <Logout/>,
          }

        ]

      },

       {
      path: "/interview/:sessionId",
      element: <InterviewRoom />,
    },
    ],
  },
]);

export default router;