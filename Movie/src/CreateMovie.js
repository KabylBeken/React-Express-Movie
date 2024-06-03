import { useState, useEffect } from "react";
import { setMovie, getAllCategories } from './api';
import { useNavigate } from "react-router-dom";
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateMovie(){

    const navigate = useNavigate();

    const [title, settitle] = useState('');
    const [price, setPrice] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleSubmit = async (e) => {
        const {success, data} = await setMovie(title, price, content, selectedCategory);
        if(success){
            navigate('/admin/movies', {state: {message: "movie added!!!"}});
        }
        else{
            toast("movie not added!!!");
        }
    };

    useEffect(() => {
        const loadCategories = async () => {
            const cats = await getAllCategories();
            setCategories(cats);
            if (cats.length > 0) {
                setSelectedCategory(cats[0].id);
            }
        };
        loadCategories();
    }, []);

    return(
        <div className="container">
            <h2>Create Movie</h2>
            <label>Title:</label><br/>
            <input type="text" className="form-control" value={title} onChange={(e) => settitle(e.target.value)} /><br/>
            <label>Price:</label><br/>
            <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} /><br/>
            <label>Content:</label><br/>
            <input type="text" className="form-control" value={content} onChange={(e) => setContent(e.target.value)} /><br/>
            <label>Category</label><br/>
            <select className="form-control" onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select><br/><br/>
            <button type="submit" onClick={handleSubmit} className="btn btn-primary">Created</button>
        </div>
    );
}

export default CreateMovie;
