import { useEffect, useState } from "react";
import { deleteUser, getOneUser } from "./api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function DeleteUser() {
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

    const handleDelete = async () => {
        const success = await deleteUser(params.userId);
        if (success) {
            toast("User deleted successfully");
            navigate('/admin/users');
        } else {
            toast("Error deleting user");
        }
    };

    return (
        <div className="container">
            <h2>Delete User</h2>
            <p>Are you sure you want to delete user {user.username}?</p>
            <button onClick={handleDelete} className="btn btn-danger">Delete</button>
        </div>
    );
}

export default DeleteUser;
