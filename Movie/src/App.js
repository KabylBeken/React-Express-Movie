import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Movies from './Movies';
import Navigation from './Navigation';
import LoginForm from './LoginForm';
import CategoryMovies from './CategoryMovies';
import MovieItem from './MovieItem';
import RegisterForm from './RegisterForm';
import CreateMovie from './CreateMovie';
import EditForm from './EditForm';
import DeleteMovie from './DeleteMovie';
import CreateCategory from './CreateCategory';
import EditCategory from './EditCategory';
import DeleteCategory from './DeleteCategory';
import Profile from './Profile';
import Page404 from './Page404';
import Footer from './Footer';
import UsersList from './UsersList';
import AddUser from './AddUser';
import EditUser from './EditUser';
import DeleteUser from './DeleteUser';
import MoviesList from './MoviesList';
import CategoriesList from './CategoriesList';
import FavoriteMovies from './FavoriteMovies';

import './css/style.css';

export default function App() {

    const routes = createBrowserRouter([
        {
            path: "/",
            element: <Navigation />,
            errorElement: <Page404 />,
            children: [
                {
                    path: 'register',
                    element: <RegisterForm />
                },
                {
                    path: 'login',
                    element: <LoginForm />
                },
                {
                    path: 'movies',
                    element: <Movies />
                },
                {
                    path: '/',
                    element: <Movies />
                },
                {
                    path: 'movies/category/:catId?',
                    element: <CategoryMovies />
                },
                {
                    path: 'movies/:movieId?',
                    element: <MovieItem />
                },
                {
                    path: 'movies/create',
                    element: <CreateMovie />
                },
                {
                    path: 'movies/:movieId/edit',
                    element: <EditForm />
                },
                {
                    path: 'movies/:movieId/delete',
                    element: <DeleteMovie />
                },
                {
                    path: 'categories',
                    element: <CategoriesList />
                },
                {
                    path: 'categories/create',
                    element: <CreateCategory />
                },
                {
                    path: 'categories/:categoryId/edit',
                    element: <EditCategory />
                },
                {
                    path: 'categories/:categoryId/delete',
                    element: <DeleteCategory />
                },
                {
                    path: 'profile',
                    element: <Profile />
                },
                {
                    path: 'admin/users',
                    element: <UsersList />
                },
                {
                    path: 'admin/users/add',
                    element: <AddUser />
                },
                {
                    path: 'admin/users/:userId/edit',
                    element: <EditUser />
                },
                {
                    path: 'admin/users/:userId/delete',
                    element: <DeleteUser />
                },
                {
                    path: 'admin/movies',
                    element: <MoviesList />
                },
                {
                    path: 'admin/categories',
                    element: <CategoriesList />
                },
                {
                    path: 'favoriteMovies',
                    element: <FavoriteMovies />
                }
            ]
        }
    ]);

    return (
        <>
            <RouterProvider router={routes} />
            <Footer />
        </>
    );
}
