import { Movie } from "../models/movie";
import { MoviePage } from "../models/moviePage";
import { MovieRepo } from "../repos/movieRepo";

export class MovieService {
    private movieRepo: MovieRepo;

    constructor() {
        this.movieRepo = new MovieRepo();
    }

    /**
     * Get a list of movie pages on demand
     * @param startPage - The starting page number
     * @param pageCount - Number of pages to fetch
     * @returns Promise<MoviePage[]> - Array of movie pages
     */
    async getMoviePagesOnDemand(startPage: number = 1, pageCount: number = 5): Promise<MoviePage[]> {
        const moviePages: MoviePage[] = [];
        
        try {
            // Fetch multiple pages concurrently for better performance
            const promises: Promise<MoviePage>[] = [];
            for (let i = 0; i < pageCount; i++) {
                const pageNumber = startPage + i;
                promises.push(this.movieRepo.getMovieList(pageNumber));
            }
            
            const results = await Promise.all(promises);
            moviePages.push(...results);
            
            return moviePages;
        } catch (error) {
            console.error('Error fetching movie pages:', error);
            throw error;
        }
    }

    /**
     * Get movie pages by genre on demand
     * @param genreId - The genre ID
     * @param pageCount - Number of pages to fetch
     * @returns Promise<MoviePage[]> - Array of movie pages
     */
    async getMoviePagesByGenreOnDemand(genreId: number, pageCount: number = 3): Promise<MoviePage[]> {
        const moviePages: MoviePage[] = [];
        
        try {
            const promises: Promise<MoviePage>[] = [];
            for (let i = 1; i <= pageCount; i++) {
                // Note: The repo method currently only supports page 1, 
                // but we can extend it to support pagination
                promises.push(this.movieRepo.getMovieListByGenre(genreId));
            }
            
            const results = await Promise.all(promises);
            moviePages.push(...results);
            
            return moviePages;
        } catch (error) {
            console.error('Error fetching movie pages by genre:', error);
            throw error;
        }
    }

    /**
     * Get movie pages by search on demand
     * @param searchTerm - The search term
     * @param pageCount - Number of pages to fetch
     * @returns Promise<MoviePage[]> - Array of movie pages
     */
    async getMoviePagesBySearchOnDemand(searchTerm: string, pageCount: number = 3): Promise<MoviePage[]> {
        const moviePages: MoviePage[] = [];
        
        try {
            const promises: Promise<MoviePage>[] = [];
            for (let i = 1; i <= pageCount; i++) {
                promises.push(this.movieRepo.getMovieListBySearch(searchTerm));
            }
            
            const results = await Promise.all(promises);
            moviePages.push(...results);
            
            return moviePages;
        } catch (error) {
            console.error('Error fetching movie pages by search:', error);
            throw error;
        }
    }

    /**
     * Get movie pages by year on demand
     * @param year - The release year
     * @param pageCount - Number of pages to fetch
     * @returns Promise<MoviePage[]> - Array of movie pages
     */
    async getMoviePagesByYearOnDemand(year: number, pageCount: number = 3): Promise<MoviePage[]> {
        const moviePages: MoviePage[] = [];
        
        try {
            const promises: Promise<MoviePage>[] = [];
            for (let i = 1; i <= pageCount; i++) {
                promises.push(this.movieRepo.getMovieListByYear(year));
            }
            
            const results = await Promise.all(promises);
            moviePages.push(...results);
            
            return moviePages;
        } catch (error) {
            console.error('Error fetching movie pages by year:', error);
            throw error;
        }
    }

    /**
     * Get movie pages by rating on demand
     * @param minRating - Minimum rating threshold
     * @param pageCount - Number of pages to fetch
     * @returns Promise<MoviePage[]> - Array of movie pages
     */
    async getMoviePagesByRatingOnDemand(minRating: number, pageCount: number = 3): Promise<MoviePage[]> {
        const moviePages: MoviePage[] = [];
        
        try {
            const promises: Promise<MoviePage>[] = [];
            for (let i = 1; i <= pageCount; i++) {
                promises.push(this.movieRepo.getMovieListByRating(minRating));
            }
            
            const results = await Promise.all(promises);
            moviePages.push(...results);
            
            return moviePages;
        } catch (error) {
            console.error('Error fetching movie pages by rating:', error);
            throw error;
        }
    }

    /**
     * Get all movies from multiple pages as a flat array
     * @param startPage - The starting page number
     * @param pageCount - Number of pages to fetch
     * @returns Promise<Movie[]> - Array of all movies from the pages
     */
    async getAllMoviesFromPages(startPage: number = 1, pageCount: number = 5): Promise<Movie[]> {
        try {
            const moviePages = await this.getMoviePagesOnDemand(startPage, pageCount);
            const allMovies: Movie[] = [];
            
            moviePages.forEach(page => {
                allMovies.push(...page.movieList);
            });
            
            return allMovies;
        } catch (error) {
            console.error('Error fetching all movies from pages:', error);
            throw error;
        }
    }

    /**
     * Get movie pages with custom filters on demand
     * @param filters - Object containing filter parameters
     * @param pageCount - Number of pages to fetch
     * @returns Promise<MoviePage[]> - Array of movie pages
     */
    async getMoviePagesWithFiltersOnDemand(filters: {
        genreId?: number;
        year?: number;
        minRating?: number;
        searchTerm?: string;
    }, pageCount: number = 3): Promise<MoviePage[]> {
        const moviePages: MoviePage[] = [];
        
        try {
            let promises: Promise<MoviePage>[] = [];
            
            if (filters.genreId) {
                for (let i = 1; i <= pageCount; i++) {
                    promises.push(this.movieRepo.getMovieListByGenre(filters.genreId!));
                }
            } else if (filters.year) {
                for (let i = 1; i <= pageCount; i++) {
                    promises.push(this.movieRepo.getMovieListByYear(filters.year!));
                }
            } else if (filters.minRating) {
                for (let i = 1; i <= pageCount; i++) {
                    promises.push(this.movieRepo.getMovieListByRating(filters.minRating!));
                }
            } else if (filters.searchTerm) {
                for (let i = 1; i <= pageCount; i++) {
                    promises.push(this.movieRepo.getMovieListBySearch(filters.searchTerm!));
                }
            } else {
                // Default to top rated movies
                for (let i = 1; i <= pageCount; i++) {
                    promises.push(this.movieRepo.getMovieList(i));
                }
            }
            
            const results = await Promise.all(promises);
            moviePages.push(...results);
            
            return moviePages;
        } catch (error) {
            console.error('Error fetching movie pages with filters:', error);
            throw error;
        }
    }
}
