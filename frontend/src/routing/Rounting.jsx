import {createBrowserRouter } from "react-router-dom"

import {Home} from "../pages/Home.jsx"
import Login from "../pages/Login.jsx"
import Signup from "../pages/Signup.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"
import StudentDashboard from "../pages/StudentDashboard.jsx"
import RecruiterDashboard from "../pages/RecruiterDashboard.jsx"


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

    path: "/student-dashboard",
    element: (
   <ProtectedRoute>
              <StudentDashboard />
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
  }
]);
export default router;