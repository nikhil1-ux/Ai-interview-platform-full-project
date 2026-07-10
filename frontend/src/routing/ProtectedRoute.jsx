import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../api/axios.js";

const ProtectedRoute = () => {
  // "checking" | "authed" | "guest"
  const [authState, setAuthState] = useState("checking");

  useEffect(() => {
    const existingToken = localStorage.getItem("accessToken");

    if (existingToken) {
      setAuthState("authed");
      return;
    }

    // No access token in this tab/session — try the refreshToken cookie
    // before giving up, so returning visitors stay logged in.
    api
      .post("/auth/refresh-token")
      .then((res) => {
        const newToken = res.data?.data?.accessToken;
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          setAuthState("authed");
        } else {
          setAuthState("guest");
        }
      })
      .catch(() => {
        setAuthState("guest");
      });
  }, []);

  if (authState === "checking") {
    // Brief silent check — avoid flashing the login page for returning users
    return null;
  }

  return authState === "authed" ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;