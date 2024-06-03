import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { getOneMovie, addFavoriteMovie, removeFavoriteMovie, getFavoriteMovies } from "./api";
import { getMoviePoster } from "./tmdbApi";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function MovieItem() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [movie, setMovie] = useState({});
    const [hasToken, setHasToken] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [posterUrl, setPosterUrl] = useState('');

    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user ? user.role : "";

    useEffect(() => {
        if (location.state) {
            toast(location.state.message);
            location.state = null;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (user)
            setHasToken(true);
    }, [location]);

    useEffect(() => {
        const loadMovie = async () => {
            const { success, data } = await getOneMovie(params.movieId);
            if (success) {
                setMovie(data);
                const posterUrl = await getMoviePoster(data.title);
                setPosterUrl(posterUrl || './images/null.jpg');
            } else {
                navigate("/login", { state: { message: data } });
            }
        }
        loadMovie();
    }, [params.movieId]);

    useEffect(() => {
        const checkFavorite = async () => {
            const { success, data } = await getFavoriteMovies();
            if (success) {
                setIsFavorite(data.some(favMovie => favMovie.id === movie.id));
            }
        }
        checkFavorite();
    }, [movie.id]);

    const handleAddFavorite = async () => {
        const { success, data } = await addFavoriteMovie(movie.id);
        if (success) {
            toast(data);
            setIsFavorite(true);
        } else {
            toast(data);
        }
    }

    const handleRemoveFavorite = async () => {
        const { success, data } = await removeFavoriteMovie(movie.id);
        if (success) {
            toast(data);
            setIsFavorite(false);
        } else {
            toast(data);
        }
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4 text-center">
                    <img src={posterUrl} alt={movie.title} className="img-fluid rounded" style={{ maxWidth: '350px' }} />
                </div>
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">{movie.title}</h2>
                            <p className="card-text"><strong>Description:</strong> {movie.content}</p>
                            <p className="card-text"><strong>Price:</strong> {movie.price}</p>
                            <p className="card-text"><strong>Year:</strong> {movie.year}</p>
                            <p className="card-text"><strong>Duration:</strong> {movie.duration}</p>
                            <p className="card-text"><strong>Country:</strong> {movie.country}</p>
                            <p className="card-text"><strong>Director:</strong> {movie.director}</p>
                            {hasToken && userRole === "user" && (
                                isFavorite ? (
                                    <button onClick={handleRemoveFavorite} className="btn btn-danger mr-2">Remove from Favorites</button>
                                ) : (
                                    <button onClick={handleAddFavorite} className="btn btn-success mr-2">Add to Favorites</button>
                                )
                            )}
                            {hasToken && userRole === "admin" && (
                                <Link className="btn btn-primary" to={`/movies/${movie.id}/edit`}>Edit</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
