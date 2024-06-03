import { useState, useEffect } from "react";
import { getOneUser, editUser } from './api';
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditUser() {
    const navigate = useNavigate();
    const params = useParams();
    const [user, setUser] = useState({});

    useEffect(() => {
        const loadUser = async () => {
            const { success, data } = await getOneUser(params.userId);
            if (success) {
                setUser(data);
            } else {
                toast("Error loading user");
            }
        };
        loadUser();
    }, [params.userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await editUser(user);
        if (success) {
            toast("User edited successfully");
            navigate('/admin/users');
        } else {
            toast("Error editing user");
        }
    };

    return (
        <div className="container">
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input type="email" id="email" className="form-control" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input type="password" id="password" className="form-control" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username:</label>
                    <input type="text" id="username" className="form-control" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role:</label>
                    <select id="role" className="form-control" value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Edit User</button>
            </form>
        </div>
    );
}

export default EditUser;
