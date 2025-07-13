// MovieService class converted to JavaScript

import { MovieRepo } from "../repos/movieRepo.js";

export class MovieService {
    constructor() {
        this.movieRepo = new MovieRepo();
    }

    /**
     * Get a list of movie pages on demand
     * @param {number} startPage - The starting page number
     * @param {number} pageCount - Number of pages to fetch
     * @returns {Promise<Array>} - Array of movie pages
     */
    async getMoviePagesOnDemand(startPage = 1, pageCount = 5) {
        const moviePages = [];
        
        try {
            // Fetch multiple pages concurrently for better performance
            const promises = [];
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
     * @param {number} genreId - The genre ID
     * @param {number} pageCount - Number of pages to fetch
     * @returns {Promise<Array>} - Array of movie pages
     */
    async getMoviePagesByGenreOnDemand(genreId, pageCount = 3) {
        const moviePages = [];
        
        try {
            const promises = [];
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
     * @param {string} searchTerm - The search term
     * @param {number} pageCount - Number of pages to fetch
     * @returns {Promise<Array>} - Array of movie pages
     */
    async getMoviePagesBySearchOnDemand(searchTerm, pageCount = 3) {
        const moviePages = [];
        
        try {
            const promises = [];
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
     * @param {number} year - The release year
     * @param {number} pageCount - Number of pages to fetch
     * @returns {Promise<Array>} - Array of movie pages
     */
    async getMoviePagesByYearOnDemand(year, pageCount = 3) {
        const moviePages = [];
        
        try {
            const promises = [];
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
     * @param {number} minRating - Minimum rating threshold
     * @param {number} pageCount - Number of pages to fetch
     * @returns {Promise<Array>} - Array of movie pages
     */
    async getMoviePagesByRatingOnDemand(minRating, pageCount = 3) {
        const moviePages = [];
        
        try {
            const promises = [];
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
     * @param {number} startPage - The starting page number
     * @param {number} pageCount - Number of pages to fetch
     * @returns {Promise<Array>} - Array of all movies from the pages
     */
    async getAllMoviesFromPages(startPage = 1, pageCount = 5) {
        try {
            const moviePages = await this.getMoviePagesOnDemand(startPage, pageCount);
            const allMovies = [];
            
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
     * @param {Object} filters - Object containing filter parameters
     * @param {number} pageCount - Number of pages to fetch
     * @returns {Promise<Array>} - Array of movie pages
     */
    async getMoviePagesWithFiltersOnDemand(filters, pageCount = 3) {
        const moviePages = [];
        
        try {
            let promises = [];
            
            if (filters.genreId) {
                for (let i = 1; i <= pageCount; i++) {
                    promises.push(this.movieRepo.getMovieListByGenre(filters.genreId));
                }
            } else if (filters.year) {
                for (let i = 1; i <= pageCount; i++) {
                    promises.push(this.movieRepo.getMovieListByYear(filters.year));
                }
            } else if (filters.minRating) {
                for (let i = 1; i <= pageCount; i++) {
                    promises.push(this.movieRepo.getMovieListByRating(filters.minRating));
                }
            } else if (filters.searchTerm) {
                for (let i = 1; i <= pageCount; i++) {
                    promises.push(this.movieRepo.getMovieListBySearch(filters.searchTerm));
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