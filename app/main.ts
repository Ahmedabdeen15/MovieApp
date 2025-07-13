import { MovieRepo } from "../repos/MovieRepo.js";
import { MovieService } from "../services/MovieService.js";
import { Movie } from "../models/Movie.js";

class MovieApp {
    private movieRepo: MovieRepo;
    private movieService: MovieService;
    private currentPage: number = 1;
    private currentMovies: Movie[] = [];
    private isLoading: boolean = false;

    constructor() {
        this.movieRepo = new MovieRepo();
        this.movieService = new MovieService(this.movieRepo);
        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        // Search functionality
        const searchBtn = document.getElementById('searchBtn') as HTMLButtonElement;
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;

        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => this.handleSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn') as HTMLButtonElement;
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreMovies());
        }

        // Initial load
        this.loadTopRated();
    }

    private async handleSearch(): Promise<void> {
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;
        const query = searchInput.value.trim();
        
        if (query) {
            await this.searchMovies(query);
        }
    }

    private async searchMovies(query: string): Promise<void> {
        this.showLoading(true);
        this.currentPage = 1;
        
        try {
            const movies = await this.movieService.searchAndSortMovies(query);
            this.currentMovies = movies;
            this.displayMovies(movies);
            this.updateStats();
            this.updateCurrentFilter(`Search: ${query}`);
        } catch (error) {
            console.error('Error searching movies:', error);
            this.showError('Failed to search movies. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    public async loadTopRated(): Promise<void> {
        this.showLoading(true);
        this.currentPage = 1;
        
        try {
            const movies = await this.movieService.getTopRatedMovies();
            this.currentMovies = movies;
            this.displayMovies(movies);
            this.updateStats();
            this.updateCurrentFilter('Top Rated');
        } catch (error) {
            console.error('Error loading top rated movies:', error);
            this.showError('Failed to load top rated movies.');
        } finally {
            this.showLoading(false);
        }
    }

    public async loadByYear(year: number): Promise<void> {
        this.showLoading(true);
        this.currentPage = 1;
        
        try {
            // For now, we'll filter from top rated movies by year
            const movies = await this.movieService.getTopRatedMovies();
            const filteredMovies = movies.filter(movie => {
                const movieYear = new Date(movie.release_date).getFullYear();
                return movieYear === year;
            });
            
            this.currentMovies = filteredMovies;
            this.displayMovies(filteredMovies);
            this.updateStats();
            this.updateCurrentFilter(`${year} Movies`);
        } catch (error) {
            console.error(`Error loading ${year} movies:`, error);
            this.showError(`Failed to load ${year} movies.`);
        } finally {
            this.showLoading(false);
        }
    }

    public async loadByRating(minRating: number): Promise<void> {
        this.showLoading(true);
        this.currentPage = 1;
        
        try {
            const movies = await this.movieService.getHighRatedMovies(minRating);
            this.currentMovies = movies;
            this.displayMovies(movies);
            this.updateStats();
            this.updateCurrentFilter(`High Rated (${minRating}+)`);
        } catch (error) {
            console.error('Error loading high rated movies:', error);
            this.showError('Failed to load high rated movies.');
        } finally {
            this.showLoading(false);
        }
    }

    public async loadMoreMovies(): Promise<void> {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.currentPage++;
        
        try {
            // For demonstration, we'll load more top rated movies
            const moreMovies = await this.movieService.getTopRatedMovies();
            this.currentMovies = [...this.currentMovies, ...moreMovies];
            this.displayMovies(this.currentMovies);
            this.updateStats();
        } catch (error) {
            console.error('Error loading more movies:', error);
            this.showError('Failed to load more movies.');
        } finally {
            this.isLoading = false;
        }
    }

    private displayMovies(movies: Movie[]): void {
        const moviesGrid = document.getElementById('moviesGrid') as HTMLDivElement;
        if (!moviesGrid) return;

        if (movies.length === 0) {
            moviesGrid.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-info">
                        <h4>No movies found</h4>
                        <p>Try adjusting your search criteria or filters.</p>
                    </div>
                </div>
            `;
            return;
        }

        const moviesHTML = movies.map(movie => this.createMovieCard(movie)).join('');
        moviesGrid.innerHTML = moviesHTML;

        // Show/hide load more button
        const loadMoreSection = document.getElementById('loadMoreSection') as HTMLDivElement;
        if (loadMoreSection) {
            loadMoreSection.style.display = movies.length >= 20 ? 'block' : 'none';
        }
    }

    private createMovieCard(movie: Movie): string {
        const posterUrl = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://placehold.co/300x450?text=No+Poster';
        
        const releaseDate = new Date(movie.release_date).toLocaleDateString();
        const rating = movie.vote_average.toFixed(1);
        const overview = movie.overview.length > 150 
            ? movie.overview.substring(0, 150) + '...' 
            : movie.overview;

        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card movie-card h-100 shadow-sm">
                    <img src="${posterUrl}" class="card-img-top movie-poster" alt="${movie.title}" 
                         onerror="this.src='https://placehold.co/300x450?text=No+Poster'">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${movie.title}</h5>
                        <div class="mb-2">
                            <span class="badge bg-primary">⭐ ${rating}</span>
                            <span class="badge bg-secondary">${releaseDate}</span>
                        </div>
                        <p class="card-text flex-grow-1">${overview}</p>
                        <div class="mt-auto">
                            <button class="btn btn-outline-primary btn-sm" onclick="showMovieDetails(${movie.id})">
                                View Details
                            </button>
                        </div>
                    </div>
                    <div class="card-footer text-muted">
                        <small>Popularity: ${movie.popularity.toFixed(0)}</small>
                    </div>
                </div>
            </div>
        `;
    }

    private showLoading(show: boolean): void {
        const loadingSpinner = document.getElementById('loadingSpinner') as HTMLDivElement;
        const moviesGrid = document.getElementById('moviesGrid') as HTMLDivElement;
        
        if (loadingSpinner) {
            loadingSpinner.style.display = show ? 'block' : 'none';
        }
        
        if (moviesGrid && show) {
            moviesGrid.innerHTML = '';
        }
    }

    private showError(message: string): void {
        const moviesGrid = document.getElementById('moviesGrid') as HTMLDivElement;
        if (moviesGrid) {
            moviesGrid.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-danger">
                        <h4>Error</h4>
                        <p>${message}</p>
                    </div>
                </div>
            `;
        }
    }

    private updateStats(): void {
        const totalMovies = document.getElementById('totalMovies');
        const totalPages = document.getElementById('totalPages');
        const avgRating = document.getElementById('avgRating');
        const currentFilter = document.getElementById('currentFilter');

        if (totalMovies) totalMovies.textContent = this.currentMovies.length.toString();
        if (totalPages) totalPages.textContent = this.currentPage.toString();
        
        if (avgRating && this.currentMovies.length > 0) {
            const average = this.currentMovies.reduce((sum, movie) => sum + movie.vote_average, 0) / this.currentMovies.length;
            avgRating.textContent = average.toFixed(1);
        }
    }

    private updateCurrentFilter(filter: string): void {
        const currentFilter = document.getElementById('currentFilter');
        if (currentFilter) currentFilter.textContent = filter;
    }
}

// Global functions for HTML onclick handlers
(window as any).loadTopRated = () => {
    if (window.movieApp) {
        window.movieApp.loadTopRated();
    }
};

(window as any).loadByYear = (year: number) => {
    if (window.movieApp) {
        window.movieApp.loadByYear(year);
    }
};

(window as any).loadByRating = (rating: number) => {
    if (window.movieApp) {
        window.movieApp.loadByRating(rating);
    }
};

(window as any).loadMoreMovies = () => {
    if (window.movieApp) {
        window.movieApp.loadMoreMovies();
    }
};

(window as any).showMovieDetails = (movieId: number) => {
    // This would open a modal or navigate to a details page
    alert(`Movie details for ID: ${movieId} - Feature coming soon!`);
};

// Initialize the app when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
    window.movieApp = new MovieApp();
});

// Declare global types
declare global {
    interface Window {
        movieApp: MovieApp;
        loadTopRated: () => void;
        loadByYear: (year: number) => void;
        loadByRating: (rating: number) => void;
        loadMoreMovies: () => void;
        showMovieDetails: (movieId: number) => void;
    }
}
