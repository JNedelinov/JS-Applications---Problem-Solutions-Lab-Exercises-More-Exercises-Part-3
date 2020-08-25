import { createMovie, getMovieById, editMovie as apiEdit, deleteMovie } from '../data.js';

// add/create movie

export async function addGet() {
    this.partials = {
        header: await this.load('../../templates/common/header.hbs'),
        footer: await this.load('../../templates/common/footer.hbs')
    }

    this.partial('../../templates/movies/addMovie.hbs', this.app.userData);
}

export async function addPost() {
    try {
        const { title, description, imageUrl } = this.params;

        if (!title || !description || !imageUrl) {
            throw new Error('Invalid input!');
        }

        const movie = { title, description, image: imageUrl, creator: this.app.userData.email, peopleLiked: [], likes: 0 };

        const result = await createMovie(movie);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result)
            throw error;
        }

        showInfo('Created successfully!');

        this.redirect('#/home');
    } catch (error) {
        showError(error.message);
        console.log(error);
    }
}

// details 

export async function details() {
    this.partials = {
        header: await this.load('../../templates/common/header.hbs'),
        footer: await this.load('../../templates/common/footer.hbs')
    }

    const movieId = this.params.id;

    const movie = await getMovieById(movieId);

    const isCreator = movie.creator === this.app.userData.email;

    let isLiked;
    if (movie.peopleLiked.includes(this.app.userData.email)) {
        isLiked = true;
    } else {
        isLiked = false;
    }

    const context = Object.assign({ isCreator, isLiked }, movie, this.app.userData);

    this.partial('../../templates/movies/details.hbs', context);
}

// edit 

export default async function editGet() {
    this.partials = {
        header: await this.load('../../templates/common/header.hbs'),
        footer: await this.load('../../templates/common/footer.hbs')
    }

    const movieId = this.params.id;

    let movie = this.app.userData.movies.find(e => e.objectId == movieId);

    if (movie === undefined) {
        movie = await getMovieById(movieId);
    }

    const context = Object.assign(movie, this.app.userData);

    this.partial('../../templates/movies/editMovie.hbs', context);
}

export async function editMovie() {
    try {
        const { title, description, imageUrl } = this.params;

        const movieId = this.params.id;

        if (!title || !description || !imageUrl) {
            throw new Error('Invalid input!');
        }

        const movie = { title, description, image: imageUrl };

        const result = await apiEdit(movieId, movie);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result)
            throw error;
        }

        showInfo('Edited successfully!');

        this.redirect(`#/details/${movieId}`);
    } catch (error) {
        showError(error.message);
    }
}

// delete

export async function movieDelete() {
    try {
        const movieId = this.params.id;

        const result = await deleteMovie(movieId);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result)
            throw error;
        }

        showInfo('Deleted successfully!')

        this.redirect('#/home');
    } catch (error) {
        showError(error.message);
    }
}

// like

export async function likeMovie() {
    try {
        const movieId = this.params.id;

        const movie = await getMovieById(movieId);

        if (!movie.peopleLiked.includes(this.app.userData.email)) {
            movie.peopleLiked.push(this.app.userData.email);  
            movie.likes += 1;          
        } else {
            throw new Error('You liked the movie already!');
        }

        const result = await apiEdit(movieId, {peopleLiked: movie.peopleLiked, likes: movie.likes});
        
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result)
            throw error;
        }
        
        showInfo('Successfully liked the movie!');

        this.redirect(`#/details/${movieId}`);
    } catch (error) {
        showError(error.message);
    }
}

// notifications

function showInfo(message) {
    const notification = document.querySelector('#successBox');
    notification.textContent = message;
    notification.parentElement.style.display = 'block';

    setTimeout(() => {
        notification.parentElement.style.display = 'none';
    }, 1000);
}
function showError(message) {
    const notification = document.querySelector('#errorBox');
    notification.textContent = message;
    notification.parentElement.style.display = 'block';

    setTimeout(() => {
        notification.parentElement.style.display = 'none';
    }, 1000);
}