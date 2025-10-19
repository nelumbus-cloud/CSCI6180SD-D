import React, { createContext, useState, useContext } from "react";
import Dashboard from "./Dashboard";

// Auth Context and Provider
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Login Component Example
const Login = ({ onLogin }) => {
  const { login } = useAuth();

  const handleLogin = () => {
    login({ username: "user" });
    onLogin();
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Log in</button>
    </div>
  );
};

// App Component (SPA)
const App = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState("login");

  // If user is logged in, show dashboard, otherwise show login
  React.useEffect(() => {
    if (user) {
      setCurrentPage("dashboard");
    } else {
      setCurrentPage("login");
    }
  }, [user]);

  return (
    <AuthProvider>
      {currentPage === "dashboard" ? (
        <Dashboard />
      ) : (
        <Login onLogin={() => setCurrentPage("dashboard")} />
      )}
    </AuthProvider>
  );
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);