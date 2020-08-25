import API from './api.js';


const endpoints = {
    MOVIES: 'data/movies',
    MOVIE_BY_ID: 'data/movies/'
};

const appId = '69AF49AC-35B3-DF8B-FF6E-D2986008F400';
const apiKey = 'D0BEE823-7EA9-4368-A1E3-2B99B9C97BC8';

const api = new API(appId, apiKey);

export const login = api.login.bind(api);
export const logout = api.logout.bind(api);
export const register = api.register.bind(api);



// get all movies

export async function getMovies() {
    return api.get(endpoints.MOVIES);
}

// get movie by ID

export async function getMovieById(id) {
    return api.get(endpoints.MOVIE_BY_ID + id);
}

// get movies by ownerId

export async function getMoviesByOwnerId() {
    const ownerId = localStorage.getItem('userId');

    return api.get(`${endpoints.MOVIES}?where=ownerId%3D%27${ownerId}%27`);
}

// create movie

export async function createMovie(movie) {
    return api.post(endpoints.MOVIES, movie);
}

// edit movie

export async function editMovie(id, updatedMovie) {
    return api.put(endpoints.MOVIE_BY_ID + id, updatedMovie);
}

// delete movie

export async function deleteMovie(id) {
    return api.delete(endpoints.MOVIE_BY_ID + id);
}

