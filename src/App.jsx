import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import Header from "./componet/Header/headers.jsx";
import Footer from "./componet/Footer/footer.jsx";
import { Outlet } from "react-router-dom";
import authService from "./appwrite/auth";

function App() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const userData = await authService.getCurrentUser();

                if (userData) {
                    dispatch(login(userData));
                } else {
                    dispatch(logout());
                }
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [dispatch]);

    if (loading) return null;

    return (
        <div className="min-h-screen flex flex-wrap content-between bg-gray-400">
            <div className="w-full block">
                <Header />
                <main>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default App;