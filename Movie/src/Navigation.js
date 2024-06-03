import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { getAllCategories, getProfile } from "./api";
import Logo from "./images/kinopoisk.svg";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [hasToken, setHasToken] = useState(false);
    const [categories, setCategories] = useState([]);
    const [role, setRole] = useState('');

    useEffect(() => {
        const loadCat = async () => {
            const categories = await getAllCategories();
            setCategories(categories);
        }
        loadCat();
    });

    useEffect(() => {
        if (location.state) {
            toast(location.state.message);
            location.state = null;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setHasToken(true);
            setRole(user.role);
        }
    }, [location]);

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
    };

    return (
        <>
            <ToastContainer autoClose={2000} />
            <div className="container-0">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-5 d-flex">
                    <Link className="navbar-brand px-5" to="/">
                        <img src={Logo} alt="Logo" width="200" height="50" />
                    </Link>
                    <div className="collapse navbar-collapse px-3">
                        <ul className="navbar-nav me-auto mb-3 mb-lg-0">
                            {categories.map((cat) => (
                                <li className="nav-item mx-3" key={cat.id}>
                                    <Link className="nav-link" to={'/movies/category/' + cat.id}>{cat.name}</Link>
                                </li>
                            ))}
                            {
                                hasToken ? (
                                    <div className="d-flex">
                                        {role === 'user' && (
                                            <li className="nav-item mx-3">
                                                <Link to="favoriteMovies" className="btn btn-primary">Favorite Movies</Link>
                                            </li>
                                        )}
                                        <li className="nav-item mx-5">
                                            <Link to="profile" className="btn btn-primary"><b>Profile</b></Link>
                                        </li>
                                        
                                        <li className="nav-item active">
                                            <button onClick={logout} className="btn btn-danger"><b>Logout</b></button>
                                        </li>
                                    </div>
                                ) : (
                                    <div className="d-flex">
                                        <li className="nav-item active mx-5">
                                            <button onClick={() => { navigate("/login") }} className="btn btn-primary"><b>Login</b></button>
                                        </li>
                                        <li className="nav-item active">
                                            <button onClick={() => { navigate("/register") }} className="btn btn-primary"><b>Register</b></button>
                                        </li>
                                    </div>
                                )
                            }
                        </ul>
                    </div>
                </nav>
            </div><br />
            <Outlet />
        </>
    );
}
