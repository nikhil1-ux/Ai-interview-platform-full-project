import {createBrowserRouter } from "react-router-dom"

import {Home} from "../pages/Home.jsx"
import Login from "../pages/Login.jsx"
import Signup from "../pages/Signup.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"
import RecruiterDashboard from "../pages/RecruiterDashboard.jsx"
import { CandidateDashboard } from "../pages/CandidateDashboard.jsx"
import AssignedInterview from "../candidComponents/AssignedInterview.jsx"
import Logout from "../candidComponents/Logout.jsx"
import Performance from "../candidComponents/Performance.jsx"
import Profile from "../candidComponents/Profile.jsx"
import Ranking from "../candidComponents/Ranking.jsx"
import Resume from "../candidComponents/Resume.jsx"



const router = createBrowserRouter([

  {
    path: "/",
    element: <Home/>
  },
   {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {

    path: "/candidate-dashboard",
    element: (
   <ProtectedRoute>
              <CandidateDashboard />
            </ProtectedRoute>

    )

  },
  {
       path: "/recruiter-dashboard",
    element: (
   <ProtectedRoute>
              <RecruiterDashboard />
            </ProtectedRoute>

    )
  },
  {

    path: "/assigned-interviews",
    element: (
   <ProtectedRoute>
              < AssignedInterview/>
            </ProtectedRoute>

    )

  },
  {

    path: "/performance",
    element: (
   <ProtectedRoute>
              <Performance />
            </ProtectedRoute>

    )

  },
  {

    path: "/profile",
    element: (
   <ProtectedRoute>
              <Profile />
            </ProtectedRoute>

    )

  },
  {

    path: "/ranking",
    element: (
   <ProtectedRoute>
              <Ranking/>
            </ProtectedRoute>

    )

  },
  {

    path: "/resume",
    element: (
   <ProtectedRoute>
              <Resume/>
            </ProtectedRoute>

    )

  },
  {

    path: "/logout",
    element: (
   <ProtectedRoute>
              <Logout/>
            </ProtectedRoute>

    )

  },
  {

    path: "/results",
    element: (
   <ProtectedRoute>
              <Performance/>
            </ProtectedRoute>

    )

  },
 

]);
export default router;