import { home } from './controllers/home.js';
import { loginGet, registerGet, logoutGet, loginPost, registerPost } from './controllers/userAuth.js';
import editGet, { addGet, addPost, details, editMovie, movieDelete, likeMovie } from './controllers/movies.js';

window.addEventListener('load', () => {

    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.userData = {
            email: localStorage.getItem('email') || '',
            userId: localStorage.getItem('userId') || '',
            movies: [],
        };

        this.get('/', home);
        this.get('#/home', home);
        this.get('index.html', home);

        this.get('#/login', loginGet);
        this.get('#/register', registerGet);
        this.get('#/logout', logoutGet);

        this.post('#/login', (ctx) => { loginPost.call(ctx); });
        this.post('#/register', (ctx) => { registerPost.call(ctx) });

        this.get('#/details/:id', details);

        this.get('#/create', addGet);
        this.post('#/create', (ctx) => { addPost.call(ctx); });

        this.get('#/edit/:id', editGet);
        this.post('#/edit/:id', (ctx) => { editMovie.call(ctx); });

        this.get('#/delete/:id', movieDelete); 

        this.get('#/like/:id', likeMovie);

        // this.get('') search-a
    });

    app.run();
})