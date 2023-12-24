import { BrowserRouter } from 'react-router-dom';
import AppRoutes from "./components/app-routes";
import { useReducer } from "react";
import { AuthContext, authReducer } from "./contexts/auth";
import "./App.scss";

const initialAuthState = {
  isAuthed: null,
  user: null
};

function App() {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ authState, dispatch }} >
        <AppRoutes />
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
