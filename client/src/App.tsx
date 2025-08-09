import "./App.css";

import Home from "./pages/home-page";
import Chat from "./pages/chat-page";
import InputOTPForm from "./pages/input-otp-form";

import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Layout from "./layout/layout";
import Event from "./pages/event-page";
import { SignUp } from "./pages/sign-up-page";
import SignIn from "./pages/sign-in-page";
import { Toaster } from "./components/ui/sonner";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/store";
import { getCurrentUserThunk } from "./store/auth/auth-thunks";
import {
  createConnection,
  disconnectConnection,
} from "./store/socket/socket.slice";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const publicPaths = ["/auth/sign-in", "/auth/sign-up"];
    const isEmailVerification = location.pathname.startsWith(
      "/auth/email-verification"
    );

    const isPublic =
      publicPaths.includes(location.pathname) || isEmailVerification;

    if (!isPublic) {
      dispatch(getCurrentUserThunk());
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("User is authenticated, creating socket connection...");
      dispatch(createConnection());
    }

    return () => {
      // Cleanup logic if needed, e.g., disconnecting the socket
      dispatch(disconnectConnection());
    };
  }, [isAuthenticated, isLoading, dispatch]);

  if (
    isLoading &&
    !["/auth/sign-in", "/auth/sign-up"].includes(location.pathname) &&
    !location.pathname.startsWith("/auth/email-verification")
  ) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="size-16 animate-up-down">
          <img src="/connectly-logo.png" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/events" element={<Event />} />
        </Route>
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route
          path="/auth/email-verification/:email"
          element={<InputOTPForm />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
