import { login, register, logout } from '../data.js';

// handling the login and loading the login page

export async function loginGet() {
    this.partials = {
        header: await this.load('../../templates/common/header.hbs'),
        footer: await this.load('../../templates/common/footer.hbs')
    }

    this.partial('../../templates/user/login.hbs', this.app.userData);
}

// sending the login request

export async function loginPost() {
    const email = this.params.email;
    const password = this.params.password;

    try {
        if (!email || !password) {
            throw new Error('All fields are required!');
        }

        if (!/\w+@[a-z]+.[a-z]{2,5}/.test(email)) {
            throw new Error('Invalid email address!');
        }

        const result = await login(email, password);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error(result.errorData);
            Object.assign(error, result);
            throw error;
        }

        showInfo('Logged in succesfully!');

        this.app.userData.email = result.email;
        this.app.userData.userId = result.objectId;

        this.redirect('#/home');
    } catch (err) {
        showError(err.message);
        return;
    }
}

// handling the register and loading the register page

export async function registerGet() {
    this.partials = {
        header: await this.load('../../templates/common/header.hbs'),
        footer: await this.load('../../templates/common/footer.hbs')
    }

    this.partial('../../templates/user/register.hbs', this.app.userData);
}

// sending the register request

export async function registerPost() {
    const email = this.params.email;
    const password = this.params.password;
    const rep_pass = this.params.repeatPassword;

    try {
        if (!email || !password || !rep_pass) {
            throw new Error('All fields are required!');
        }

        if (password !== rep_pass) {
            throw new Error('Passwords do not match!');
        }

        if (!/\w+@[a-z]+.[a-z]{2,5}/.test(email)) {
            throw new Error('Invalid email address!\n\n');
        }

        if (password.length < 6) {
            throw new Error('The password should be at least 6 characters long!');
        }

        const result = await register(email, password);

        if (result.hasOwnProperty('errorData')) {
            const error = new Error(result.errorData);
            Object.assign(error, result);
            throw error;
        }

        showInfo('Successful registration!');

        this.app.userData.email = result.email;
        this.app.userData.userId = result.objectId;

        this.redirect('#/home');
    } catch (err) {
        showError(err.message);
        return;
    }
}

// handling and sending the logout request

export async function logoutGet() {
    try {
        const result = await logout();

        if (result.hasOwnProperty('errorData')) {
            const error = new Error(result.errorData);
            Object.assign(error, result);
            throw error;
        }

        this.app.userData.email = '';
        this.app.userData.userId = '';
        this.app.userData.movies = [];

        showInfo('Successful logout!')

        this.redirect('#/home');
    } catch (err) {
        alert(err.message);
        return;
    }
}

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