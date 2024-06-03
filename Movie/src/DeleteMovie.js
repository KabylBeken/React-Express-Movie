import { useState, useEffect } from "react";
import { deleteMovie, getOneMovie } from './api';
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DeleteMovie(){

    const navigate = useNavigate();
    const params = useParams();
    const [movie, setMovie] = useState([]);

    useEffect(() => {
        const loadMovie = async () => {
            const {success, data} = await getOneMovie(params.movieId);
            if(success){
                setMovie(data);
            }
            else{
                navigate("/login");
            }
        }
        loadMovie();
    },[params.movieId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await deleteMovie(params.movieId);
        if(success){
            toast("Movie removed!!");
            navigate('/movies/my');
        }
        else{
            toast("Movie error!!");
            
        }
    };
    return(
        <div className="container my-5">
            <div className="card">
                <div className="card-header bg-danger text-white">
                    <h2 className="mb-0">Deleting a movie</h2>
                </div>
                <div className="card-body">
                    <h4 className="card-title">Are you sure you want to remove "{movie.title}"?</h4>
                    <button type="submit" className="btn btn-success mr-2 m-2" onClick={handleSubmit}>Yes</button>
                    <Link to="/movies/my" className="btn btn-secondary">No</Link>
                </div>
            </div>
        </div>
    );
}

export default DeleteMovie;