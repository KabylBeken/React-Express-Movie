import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { getFavoriteMovies, removeFavoriteMovie } from './api';
import { getMoviePoster } from "./tmdbApi";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FavoriteMovies() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const loadFavoriteMovies = async () => {
            const { success, data } = await getFavoriteMovies();
            if (success) {
                const moviesWithPosters = await Promise.all(data.map(async (movie) => {
                    const posterUrl = await getMoviePoster(movie.title);
                    return { ...movie, posterUrl: posterUrl || './images/null.jpg' };
                }));
                setMovies(moviesWithPosters);
            } else {
                toast(data);
            }
        };
        loadFavoriteMovies();

        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setHasToken(true);
        }
    }, []);

    const handleRemoveFavorite = async (movieId) => {
        const { success, data } = await removeFavoriteMovie(movieId);
        if (success) {
            toast(data);
            // Удаляем фильм из списка избранных
            setMovies(movies.filter(movie => movie.id !== movieId));
        } else {
            toast(data);
        }
    }

    return (
        <div className="container mb-5 pb-5 pt-3">
            <div className="row row-cols-1 row-cols-sm-5 g-4">
                {movies.map((movie) => (
                    <div className="col" key={movie.id}>
                        <div className="card h-100 shadow" style={{ width: '100%', maxWidth: '200px' }}>
                            <img src={movie.posterUrl} className="card-img-top" alt={movie.title} style={{ width: '100%', height: 'auto' }} />
                            <div className="card-body" style={{ padding: '0.5rem' }}>
                                <h5 className="card-title" style={{ fontSize: '1rem' }}>{movie.title}</h5>
                                <p className="card-text" style={{ fontSize: '0.875rem' }}>Price: ${movie.price}</p>
                                <div className="mt-auto">
                                    <Link className="btn btn-primary btn-sm mr-2" to={'/movies/' + movie.id}>View Details</Link>
                                    {hasToken && (
                                        <button onClick={() => handleRemoveFavorite(movie.id)} className="btn btn-danger btn-sm mt-1">Remove from Favorites</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    );
}
