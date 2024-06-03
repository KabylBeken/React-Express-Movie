import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllUsersAdmin, deleteUser } from './api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UsersList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            const { success, data } = await getAllUsersAdmin();
            if (success) {
                setUsers(data);
            } else {
                toast("Error loading users");
            }
        };
        loadUsers();
    }, []);

    const handleDelete = async (id) => {
        const success = await deleteUser(id);
        if (success) {
            toast("User deleted successfully");
            setUsers(users.filter(user => user.id !== id));
        } else {
            toast("Error deleting user");
        }
    };

    return (
        <div className="container">
            <h2>Users List</h2>
            <Link to="/admin/users/add" className="btn btn-primary mb-3">Add User</Link>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                <Link to={`/admin/users/${user.id}/edit`} className="btn btn-warning mr-2">Edit</Link>
                                <button onClick={() => handleDelete(user.id)} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UsersList;
