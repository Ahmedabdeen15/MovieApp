import { MovieRepo } from "../repos/MovieRepo";
import { Movie } from "../models/Movie";

export class MovieService {
    private repo: MovieRepo;
    private pageNumber: number = 1;
    constructor(repo: MovieRepo) {
        this.repo = repo;
    }

    async getTopRatedMovies(): Promise<Movie[]> {
        const data = await this.repo.getMovieList(this.pageNumber);
        this.pageNumber++;
        return data.movieList;
    }

    async getHighRatedMovies(minRating: number = 8): Promise<Movie[]> {
        const data = await this.repo.getMovieListByRating(minRating);
        return data.movieList;
    }

    async searchAndSortMovies(query: string): Promise<Movie[]> {
        const data = await this.repo.getMovieListBySearch(query);
        return data.movieList.sort((a, b) => b.popularity - a.popularity);
    }

    async getMoviesByGenrePaginated(genreId: number, pages: number = 3): Promise<Movie[]> {
        const results: Movie[] = [];
        for (let i = 1; i <= pages; i++) {
            const pageData = await this.repo.getMovieListByGenre(genreId);
            results.push(...pageData.movieList);
        }
        return results;
    }

    async getMovieDetailsFormatted(id: number): Promise<Movie & { formattedDate: string }> {
        const movie = await this.repo.getMovieDetails(id);
        const formattedDate = new Date(movie.release_date).toLocaleDateString();
        return {
            ...movie,
            formattedDate
        };
    }

    async getMoviesByGenreAndYear(genreId: number, year: number): Promise<Movie[]> {
        const genreMovies = await this.repo.getMovieListByGenre(genreId);
        return genreMovies.movieList.filter(
            m => new Date(m.release_date).getFullYear() === year
        );
    }
}
