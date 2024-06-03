import { useState, useEffect } from "react";
import { deleteCategory, getOneCategory } from './api';
import { useNavigate, useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DeleteCategory() {

    const navigate = useNavigate();
    const params = useParams();
    const [category, setCategory] = useState([]);

    useEffect(() => {
        const loadCategory = async () => {
            const { success, data } = await getOneCategory(params.categoryId);
            if (success) {
                setCategory(data);
            } else {
                navigate("/login");
            }
        }
        loadCategory();
    }, [params.categoryId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await deleteCategory(params.categoryId);
        if (success) {
            toast("Category removed!!");
            navigate('/categories');
        } else {
            toast("Category error!!");
        }
    };

    return (
        <div className="container my-5">
            <div className="card">
                <div className="card-header bg-danger text-white">
                    <h2 className="mb-0">Deleting a category</h2>
                </div>
                <div className="card-body">
                    <h4 className="card-title">Are you sure you want to remove "{category.name}"?</h4>
                    <button type="submit" className="btn btn-success mr-2 m-2" onClick={handleSubmit}>Yes</button>
                    <Link to="/categories" className="btn btn-secondary">No</Link>
                </div>
            </div>
        </div>
    );
}

export default DeleteCategory;
