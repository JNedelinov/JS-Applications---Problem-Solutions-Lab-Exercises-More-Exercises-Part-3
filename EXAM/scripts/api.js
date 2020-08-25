export default class API {
    constructor(appId, apiKey) {
        this.appId = appId,
            this.apiKey = apiKey;
        this.endpoints = {
            REGISTER: "users/register",
            LOGIN: "users/login",
            LOGOUT: "users/logout",
        };
    }

    host(endpoint) {
        return `https://api.backendless.com/${this.appId}/${this.apiKey}/${endpoint}`;
    }

    getOptions(headers) {
        const token = localStorage.getItem('userToken');

        const options = { headers: headers || {} };

        if (token !== null) {
            Object.assign(options.headers, { 'user-token': token });
        }

        return options;
    }

    // CRUD операциите (get, post, put, delete)

    async get(endpoint) {
        const options = this.getOptions();

        let result;

        if (endpoint !== this.endpoints.LOGOUT) {
            result = (await fetch(this.host(endpoint), options)).json();
        } else {
            result = fetch(this.host(endpoint), options);
        }

        return result;
    }

    async post(endpoint, body) {
        const options = this.getOptions({ 'Content-Type': "application/json" });

        options.method = "POST";
        options.body = JSON.stringify(body);

        const result = (await fetch(this.host(endpoint), options)).json();

        return result;
    }

    async put(endpoint, body) {
        const options = this.getOptions({ 'Content-Type': "application/json" });

        options.method = "PUT";
        options.body = JSON.stringify(body);

        const result = (await fetch(this.host(endpoint), options)).json();

        return result;
    }

    async delete(endpoint) {
        const options = this.getOptions();

        options.method = "DELETE";

        const result = (await fetch(this.host(endpoint), options)).json();

        return result;
    }

    // LOGIN/REGISTER/LOGOUT

    async register(email, password) {
        // return this.post(this.endpoints.REGISTER, { email, password });

        const emailRes = await this.post(this.endpoints.REGISTER, { email, password });

        await this.login(email, password);

        return emailRes;
    }

    async login(email, password) {
        const result = await this.post(this.endpoints.LOGIN, { login: email, password });

        localStorage.setItem('userToken', result['user-token']);
        localStorage.setItem('email', result.email);
        localStorage.setItem('userId', result.objectId);

        return result;
    }

    async logout() {
        const result = this.get(this.endpoints.LOGOUT);
        localStorage.clear();
        return result;
    }

}