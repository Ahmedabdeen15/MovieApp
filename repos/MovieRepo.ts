import { Movie, MoviePage } from "../models/Movie";

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NDliZWZiOGViNzRkZDVjMDVmZTg1ZmMwNGJkZWFlZCIsIm5iZiI6MTc1MTgyOTAzOS43OTksInN1YiI6IjY4NmFjYTJmOGFmNjE1YzA0ZDlhNDExMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.48kThTWibmI2tbh7Dw_1q3kOLogX9mKZQ4zswLT07AY'
    }
};

export class MovieRepo {
    async getMovieList(page: number,language = "en-US"): Promise<MoviePage> {
        const response = await fetch(`https://api.themoviedb.org/3/trending/all/day?language=${language}&page=${page}`, options);
        const data = await response.json();
        return {
            movieList: data.results,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        };
    }

    async getMovieDetails(id: number): Promise<Movie> {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options);
        const data = await response.json();
        return data;
    }

    async getMovieListByGenre(genreId: number): Promise<MoviePage> {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=1`, options);
        const data = await response.json();
        return {
            movieList: data.results,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        };
    }

    async getMovieListBySearch(search: string): Promise<MoviePage> {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(search)}&language=en-US&page=1`, options);
        const data = await response.json();
        return {
            movieList: data.results,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        };
    }

    async getMovieListByActor(actorId: number): Promise<MoviePage> {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_people=${actorId}&language=en-US&page=1`, options);
        const data = await response.json();
        return {
            movieList: data.results,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        };
    }

    async getMovieListByDirector(directorId: number): Promise<MoviePage> {
        return this.getMovieListByActor(directorId);
    }

    async getMovieListByWriter(writerId: number): Promise<MoviePage> {
        return this.getMovieListByActor(writerId);
    }

    async getMovieListByProducer(producerId: number): Promise<MoviePage> {
        return this.getMovieListByActor(producerId);
    }

    async getMovieListByStudio(studioId: number): Promise<MoviePage> {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_companies=${studioId}&language=en-US&page=1`, options);
        const data = await response.json();
        return {
            movieList: data.results,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        };
    }

    async getMovieListByCountry(countryCode: string): Promise<MoviePage> {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_countries=${countryCode}&language=en-US&page=1`, options);
        const data = await response.json();
        return {
            movieList: data.results,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        };
    }

    async getMovieListByYear(year: number): Promise<MoviePage> {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&language=en-US&page=1`, options);
        const data = await response.json();
        return {
            movieList: data.results,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        };
    }

    async getMovieListByRating(rating: number): Promise<MoviePage> {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?vote_average.gte=${rating}&language=en-US&page=1`, options);
        const data = await response.json();
        return {
            movieList: data.results,
            page: data.page,
            total_pages: data.total_pages,
            total_results: data.total_results
        };
    }
}
