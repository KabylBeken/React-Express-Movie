import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllMovies, deleteMovie } from './api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MoviesList() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const loadMovies = async () => {
            const { success, data } = await getAllMovies();
            if (success) {
                setMovies(data);
            } else {
                toast("Error loading movies");
            }
        };
        loadMovies();
    }, []);

    const handleDelete = async (id) => {
        const success = await deleteMovie(id);
        if (success) {
            toast("Movie deleted successfully");
            setMovies(movies.filter(movie => movie.id !== id));
        } else {
            toast("Error deleting movie");
        }
    };

    return (
        <div className="container">
            <h2>Movies List</h2>
            <Link to="/movies/create" className="btn btn-primary mb-3">Add Movie</Link>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map(movie => (
                        <tr key={movie.id}>
                            <td>{movie.id}</td>
                            <td>{movie.title}</td>
                            <td>{movie.price}</td>
                            <td>{movie.categoryId}</td>
                            <td>
                                <Link to={`/movies/${movie.id}/edit`} className="btn btn-warning mr-2 ">Edit</Link>
                                <button onClick={() => handleDelete(movie.id)} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MoviesList;
