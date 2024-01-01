import { BrowserRouter } from 'react-router-dom';
import AppRoutes from "./app-routes";
import { useReducer } from "react";
import { AuthContext, authReducer } from "./contexts/auth";
import "./App.scss";

const initialAuthState = {
  isAuthed: null,
  user: undefined
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
