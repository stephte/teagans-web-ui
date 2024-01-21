import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import RequireAuth from "./components/require-auth";
import RequireNoAuth from "./components/require-no-auth";
import Home from "./pages/home";
import Login from "./pages/login";
import CreateEditUser from "./pages/create-edit-user";
import DeleteUser from "./pages/delete-user";
import ForgotPassword from "./pages/forgot-password";
import NewPassword from "./pages/new-password";
import ResetToken from "./pages/reset-token";
import NotFound from "./pages/not-found";
import NavBar from "./components/navbar";
import DownloadVid from "./pages/download";
import Users from "./pages/users";
import useAuthStore from "./stores/auth-store";
import { getUser } from "./data/user";
import "./App.scss";

function App() {
    const isAuthed = useAuthStore(state => state.isAuthed);
    const clearUser = useAuthStore(state => state.clear);

    useEffect(() => {
        if (isAuthed && clearUser) {
            getUser("current")
                .catch((err) => {
                    if (err.response.status === 401) {
                        clearUser();
                    }
                });
        }
    }, [isAuthed, clearUser]);

    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                {/*no authed routes*/}
                <Route path="/login" element={<RequireNoAuth> <Login /> </RequireNoAuth>} />
                <Route path="/create-account" element={<RequireNoAuth> <CreateEditUser /> </RequireNoAuth>} />
                <Route path="/forgot-password" element={<RequireNoAuth> <ForgotPassword /> </RequireNoAuth>} />
                <Route path="/reset-token" element={<RequireNoAuth> <ResetToken /> </RequireNoAuth>} />
                <Route path="/new-password" element={<RequireNoAuth> <NewPassword /> </RequireNoAuth>} />

                {/*authed routes*/}
                <Route path="/download" element={<RequireAuth> <DownloadVid /> </RequireAuth>} />
                <Route path="/users" element={<RequireAuth authLevel={2}> <Users /> </RequireAuth>} />
                <Route path="/users/:id" element={<RequireAuth> <CreateEditUser /> </RequireAuth>} />
                <Route path="/add-user" element={<RequireAuth authLevel={2}> <CreateEditUser /> </RequireAuth>} />
                <Route path="/delete-user/:id" element={<RequireAuth> <DeleteUser /> </RequireAuth>} />

                {/*dont care routes*/}
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
