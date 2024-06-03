import axios from 'axios';

const authHeader = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token }
    } else {
        return {};
    }
}

export const doLogin = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:3005/login',
            {
                email: email,
                password: password
            },
            { headers: authHeader() }
        );

        localStorage.setItem("user", JSON.stringify(response.data));
        return { success: true, data: "You successfully logged in!" };

    } catch (error) {
        return { success: false, data: error };
    }
}

export const doRegister = async (email, password, username) => {
    try {
        const response = await axios.post('http://localhost:3005/register',
            {
                email: email,
                password: password,
                username: username
            },
            { headers: authHeader() }
        )

        return { success: true, data: "You successfully registered!" };

    } catch (error) {
        return { success: false, data: error };
    }
}

export const editMovie = async (movie) => {
    try {
        const formData = new FormData();
        formData.append('title', movie.title);
        formData.append('price', movie.price);
        formData.append('content', movie.content);
        formData.append('categoryId', movie.categoryId);
        if (movie.photo) {
            formData.append('photo', movie.photo);
        }

        const response = await axios.put('http://localhost:3005/movies/' + movie.id + '/edit',
            formData,
            {
                headers: {
                    ...authHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return { success: true };

    } catch (error) {
        return { success: false };
    }
}

export const deleteMovie = async (id) => {
    try {
        const response = await axios.delete('http://localhost:3005/movies/delete/' + id,
            {
                headers: authHeader()
            }
        )

        return { success: true };

    } catch (error) {
        return { success: false };
    }
}

export const setMovie = async (title, price, content, categories, photo) => {
    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', price);
        formData.append('content', content);
        formData.append('categoryId', categories);
        formData.append('photo', photo);

        const response = await axios.post('http://localhost:3005/movies/create',
            formData,
            {
                headers: {
                    ...authHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            }
        )

        return { success: true, data: response.message };

    } catch (error) {
        return { success: false, data: error };
    }
}

export const getAllMovies = async () => {
    try {
        const response = await axios.get('http://localhost:3005/movies');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, data: error.response.data.error };
    }
}

export const getOneMovie = async (movieId) => {
    try {
        const response = await axios.get('http://localhost:3005/movies/' + movieId,
            { headers: authHeader() }
        )
        return { success: true, data: response.data };

    } catch (error) {
        return { success: false, data: error.response.data.error };
    }
}

export const getAllCategories = async () => {
    const response = await axios.get('http://localhost:3005/categories');
    return response.data;
}

export const getCategoryMovies = async (catId) => {
    try {
        const response = await axios.get('http://localhost:3005/movies/category/' + catId,
            { headers: authHeader() }
        )
        return { success: true, data: response.data };

    } catch (error) {
        return { success: false, data: error.response.data.error };
    }
}

export const getMyMovies = async () => {
    try {
        const response = await axios.get('http://localhost:3005/privateMovies',
            { headers: authHeader() }
        )
        return { success: true, data: response.data };

    } catch (error) {
        return { success: false, data: "Error" };
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axios.get('http://localhost:3005/users')
        return { success: true, data: response.data };

    } catch (error) {
        return { success: false, data: error.response.data.error };
    }
}

export const getProfile = async () => {
    try {
        const response = await axios.get('http://localhost:3005/profile', { headers: authHeader() });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, data: error.response ? error.response.data : error.message };
    }
}

export const setCategory = async (name) => {
    try {
        const response = await axios.post('http://localhost:3005/categories/create', { name }, { headers: authHeader() });
        return { success: true, data: response.message };
    } catch (error) {
        return { success: false, data: error };
    }
}

export const deleteCategory = async (id) => {
    try {
        const response = await axios.delete('http://localhost:3005/categories/delete/' + id, { headers: authHeader() });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export const editCategory = async (category) => {
    try {
        const response = await axios.put('http://localhost:3005/categories/' + category.id + '/edit', { name: category.name }, { headers: authHeader() });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export const getOneCategory = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3005/categories/${id}`, { headers: authHeader() });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, data: error.response ? error.response.data : error.message };
    }
}

export const getAllUsersAdmin = async () => {
    try {
        const response = await axios.get('http://localhost:3005/admin/users', { headers: authHeader() });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, data: error.response.data.error };
    }
}

export const editUser = async (user) => {
    try {
        const response = await axios.put('http://localhost:3005/admin/users/' + user.id + '/edit', user, { headers: authHeader() });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete('http://localhost:3005/admin/users/' + id + '/delete', { headers: authHeader() });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export const getOneUser = async (userId) => {
    try {
        const response = await axios.get('http://localhost:3005/admin/users/' + userId, 
        { 
            headers: authHeader() 
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response.data };
    }
}

export const addFavoriteMovie = async (movieId) => {
    try {
        const response = await axios.post('http://localhost:3005/favoriteMovies',
            { movieId },
            { headers: authHeader() }
        );

        return { success: true, data: response.data.message };

    } catch (error) {
        return { success: false, data: error.response.data.message };
    }
}

export const removeFavoriteMovie = async (movieId) => {
    try {
        const response = await axios.delete('http://localhost:3005/favoriteMovies/' + movieId,
            { headers: authHeader() }
        );

        return { success: true, data: response.data.message };

    } catch (error) {
        return { success: false, data: error.response.data.message };
    }
}

export const getFavoriteMovies = async () => {
    try {
        const response = await axios.get('http://localhost:3005/favoriteMovies', { headers: authHeader() });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, data: error.response ? error.response.data : error.message };
    }
}








