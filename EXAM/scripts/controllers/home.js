import { getMovies } from "../data.js";

export async function home() {
    this.partials = {
        header: await this.load('../../templates/common/header.hbs'),
        footer: await this.load('../../templates/common/footer.hbs')
    }

    const movies = await getMovies();

    this.app.userData.movies = movies;

    this.partial('../../templates/home.hbs', this.app.userData);
}