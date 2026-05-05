import { Authenticator } from "./features/auth/Authenticator";
import RequireAuth from "./components/RequireAuth";

function App(): JSX.Element {
  return (
    <Authenticator>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
      </Routes>
    </Authenticator>
  );
}