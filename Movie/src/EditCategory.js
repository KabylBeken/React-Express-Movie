import { useState, useEffect } from "react";
import { editCategory, getOneCategory } from './api';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditCategory() {
    const navigate = useNavigate();
    const params = useParams();
    const [category, setCategory] = useState({ name: '' });

    useEffect(() => {
        const loadCategory = async () => {
            const { success, data } = await getOneCategory(params.categoryId);
            if (success) {
                setCategory(data);
            } else {
                navigate("/login", { state: { message: data } });
            }
        }
        loadCategory();
    }, [params.categoryId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { success, data } = await editCategory(category);
        if (success) {
            toast('Category updated successfully!');
            navigate('/categories');
        } else {
            toast('Error updating category');
        }
    };

    const handleName = (ev) => {
        setCategory({ ...category, name: ev.target.value });
    }

    return (
        <div className="container">
            <h2>Edit Category</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input type="text" id="name" value={category.name} className="form-control" onChange={handleName} required />
                </div>
                <button type="submit" className="btn btn-primary">Edit</button>
            </form>
        </div>
    );
}

export default EditCategory;
