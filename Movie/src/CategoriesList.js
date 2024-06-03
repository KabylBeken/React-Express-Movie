import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllCategories, deleteCategory } from './api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CategoriesList() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            const data = await getAllCategories();
            setCategories(data);
        };
        loadCategories();
    }, []);

    const handleDelete = async (id) => {
        const success = await deleteCategory(id);
        if (success) {
            toast("Category deleted successfully");
            setCategories(categories.filter(category => category.id !== id));
        } else {
            toast("Error deleting category");
        }
    };

    return (
        <div className="container">
            <h2>Categories List</h2>
            <Link to="/categories/create" className="btn btn-primary mb-3">Add Category</Link>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>
                                <Link to={`/categories/${category.id}/edit`} className="btn btn-warning mr-2">Edit</Link>
                                <button onClick={() => handleDelete(category.id)} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CategoriesList;
