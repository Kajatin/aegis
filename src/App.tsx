import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Root from "./app/root";
import ErrorScreen from "./app/error";

import ResetScreen from "./app/auth/reset";
import UnlockScreen from "./app/auth/unlock";
import WelcomeScreen from "./app/auth/welcome";
import OnboardingScreen from "./app/auth/onboarding";
import AuthCreateScreen from "./app/auth/create";
import CreateStep1Screen from "./app/auth/create/step-1";
import CreateStep2Screen from "./app/auth/create/step-2";

import PasswordsScreen from "./app/passwords";
import AuthenticatorScreen from "./app/authenticator";

import Protected from "./shared/protected";
import AppLayout from "./shared/appLayout";
import AuthLayout from "./shared/authLayout";

import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Root />
      </Protected>
    ),
    errorElement: <ErrorScreen />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "welcome", element: <WelcomeScreen /> },
      { path: "onboarding", element: <OnboardingScreen /> },
      {
        path: "create",
        element: <AuthCreateScreen />,
        children: [
          { path: "", element: <CreateStep1Screen /> },
          { path: "step-2", element: <CreateStep2Screen /> },
        ],
      },
      { path: "unlock", element: <UnlockScreen /> },
      { path: "reset", element: <ResetScreen /> },
    ],
  },
  {
    path: "/app",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [
      { path: "authenticator", element: <AuthenticatorScreen /> },
      { path: "passwords", element: <PasswordsScreen /> },
    ],
  },
  // {
  //   path: "/settings",
  //   element: (
  //     <Protected>
  //       <SettingsLayout />
  //     </Protected>
  //   ),
  //   children: [
  //     { path: "general", element: <GeneralSettingsScreen /> },
  //     { path: "shortcuts", element: <ShortcutsSettingsScreen /> },
  //     { path: "account", element: <AccountSettingsScreen /> },
  //   ],
  // },
]);

export default function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={<p>Loading..</p>}
      future={{ v7_startTransition: true }}
    />
  );
}
