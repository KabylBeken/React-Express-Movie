import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
    };

    return (
        <div className="container mt-5">
            {user && (
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Welcome, {user.username}</h2>
                    </div>
                    <div className="card-body">
                        <p className="card-text"><b>Email:</b> {user.email}</p>
                        <p className="card-text"><b>Role:</b> {user.role}</p>
                        {user.role === 'admin' && (
                            <div className="mt-4">
                                <h3>Admin Section</h3>
                                <p>Only admins can see this section.</p>
                                <div className="d-flex gap-2 mt-3">
                                    <Link to="/admin/users" className="btn btn-secondary"><b>Users</b></Link>
                                    <Link to="/admin/movies" className="btn btn-secondary"><b>Movies</b></Link>
                                    <Link to="/admin/categories" className="btn btn-secondary"><b>Categories</b></Link>
                                </div>
                            </div>
                        )}
                        <div className="mt-4">
                            <button onClick={logout} className="btn btn-danger"><b>Logout</b></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
