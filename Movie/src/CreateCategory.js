import { useState } from "react";
import { setCategory } from './api';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateCategory() {

    const navigate = useNavigate();
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { success, data } = await setCategory(name);
        if (success) {
            navigate('/admin/categories', { state: { message: "Category added!!!" } });
        } else {
            toast("Category not added!");
        }
    };

    return (
        <div className="container">
            <h2>Create Category</h2>
            <label>Name:</label><br />
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} /><br />
            <button type="submit" onClick={handleSubmit} className="btn btn-primary">Create</button>
        </div>
    );
}

export default CreateCategory;
