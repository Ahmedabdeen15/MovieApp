import { MovieRepo } from "../repos/MovieRepo.js";
import { MovieService } from "../services/MovieService.js";
import { Movie } from "../models/Movie.js";
import { UserService } from "../services/userService.js";

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
                <div class="card movie-card h-100 shadow-sm border-0">
                    <div class="position-relative">
                        <img src="${posterUrl}" class="card-img-top movie-poster" alt="${movie.title}" 
                             onerror="this.src='https://placehold.co/300x450?text=No+Poster'"
                             style="height: 400px; object-fit: cover;">
                        <div class="position-absolute top-0 end-0 m-2">
                            <span class="badge bg-warning text-dark fs-6">
                                <i class="bi bi-star-fill me-1"></i>${rating}
                            </span>
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column p-3">
                        <h5 class="card-title fw-bold text-truncate mb-2" title="${movie.title}">${movie.title}</h5>
                        <div class="mb-3">
                            <span class="badge bg-info text-dark">
                                <i class="bi bi-calendar3 me-1"></i>${releaseDate}
                            </span>
                        </div>
                        <p class="card-text flex-grow-1 text-muted small lh-sm">${overview}</p>
                        <div class="mt-auto d-grid">
                            <button class="btn btn-primary btn-sm" onclick="showMovieDetails(${movie.id})">
                                <i class="bi bi-eye me-2"></i>View Details
                            </button>
                        </div>
                    </div>
                    <div class="card-footer border-0 text-center">
                        <small class="text-muted">
                            <i class="bi bi-graph-up me-1"></i>Popularity: ${movie.popularity.toFixed(0)}
                        </small>
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

    public showMovieDetails(movieId: number): void {
        const movie = this.currentMovies.find(m => m.id === movieId);
        if (!movie) {
            this.showError('Movie not found.');
            return;
        }

        this.displayMovieDetails(movie);
    }

    private displayMovieDetails(movie: Movie): void {
        const moviesGrid = document.getElementById('moviesGrid') as HTMLDivElement;
        if (!moviesGrid) return;

        const backdropUrl = movie.backdrop_path 
            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            : 'https://placehold.co/1280x720?text=No+Backdrop';
        
        const posterUrl = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://placehold.co/300x450?text=No+Poster';

        const releaseDate = new Date(movie.release_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const rating = movie.vote_average.toFixed(1);
        const voteCount = movie.vote_count.toLocaleString();

        moviesGrid.innerHTML = `
            <div class="col-12">
                <!-- Hero Section with Backdrop -->
                <div class="card border-0 shadow-lg mb-4">
                    <div class="position-relative" style="height: 300px; background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('${backdropUrl}'); background-size: cover; background-position: center;">
                        <div class="bottom-0 start-0 p-4">
                            <button class="btn btn-outline-light btn-lg" onclick="returnToMovieGrid()">
                                <i class="bi bi-arrow-left me-2"></i>
                                Back to Movies
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Movie Details Card -->
                <div class="card border-0 shadow">
                    <div class="card-body p-4 p-md-5">
                        <div class="row g-4">
                            <!-- Movie Poster -->
                            <div class="col-lg-4 col-md-5">
                                <div class="position-sticky" style="top: 20px;">
                                    <img src="${posterUrl}" class="img-fluid rounded shadow-lg w-100" alt="${movie.title}"
                                         onerror="this.src='https://placehold.co/300x450?text=No+Poster'"
                                         style="max-height: 600px; object-fit: cover;">
                                </div>
                            </div>
                            
                            <!-- Movie Information -->
                            <div class="col-lg-8 col-md-7">
                                <!-- Title Section -->
                                <div class="mb-4">
                                    <h1 class="display-5 fw-bold text-light mb-2">${movie.title}</h1>
                                    ${movie.original_title !== movie.title ? 
                                        `<h2 class="h5 text-muted mb-3 fst-italic">${movie.original_title}</h2>` : ''}
                                </div>

                                <!-- Rating and Basic Info -->
                                <div class="row g-3 mb-4">
                                    <div class="col-sm-6 col-6">
                                        <div class="d-flex align-items-center">
                                            <span class="badge bg-warning text-dark fs-6 me-2">
                                                <i class="bi bi-star-fill me-1"></i>${rating}
                                            </span>
                                            <small class="text-muted">(${voteCount} votes)</small>
                                        </div>
                                    </div>
                                    <div class="col-sm-6 col-6">
                                        <span class="badge bg-info text-dark fs-6">
                                            <i class="bi bi-calendar3 me-1"></i>${releaseDate}
                                        </span>
                                    </div>
                                </div>

                                <!-- Detailed Information Cards -->
                                <div class="row g-3 mb-4">
                                    <div class="col-md-6">
                                        <div class="card border h-100">
                                            <div class="card-body text-center">
                                                <h6 class="card-title text-primary mb-1">
                                                    <i class="bi bi-translate me-2"></i>Language
                                                </h6>
                                                <p class="card-text fw-semibold mb-0">${movie.original_language.toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card border h-100">
                                            <div class="card-body text-center">
                                                <h6 class="card-title text-success mb-1">
                                                    <i class="bi bi-graph-up me-2"></i>Popularity
                                                </h6>
                                                <p class="card-text fw-semibold mb-0">${movie.popularity.toFixed(0)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Overview Section -->
                                <div class="mb-4">
                                    <h3 class="h4 mb-3 text-primary border-bottom border-primary pb-2">
                                        <i class="bi bi-file-text me-2"></i>Overview
                                    </h3>
                                    <p class="lead text-muted lh-lg">${movie.overview || 'No overview available for this movie.'}</p>
                                </div>

                                <!-- Action Buttons -->
                                <div class="d-flex flex-wrap gap-3 pt-3 border-top">
                                    <button class="btn btn-primary btn-lg px-4 w-100" onclick="returnToMovieGrid()">
                                        <i class="bi bi-arrow-left me-2"></i>
                                        Back to Movies
                                    </button>
                                    <button class="btn btn-outline-secondary btn-lg px-4 w-100" onclick="window.open('https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}', '_blank')">
                                        <i class="bi bi-box-arrow-up-right me-2"></i>
                                        View on IMDb
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Hide other sections
        this.hideMovieGridSections();
    }

    private hideMovieGridSections(): void {
        const loadMoreSection = document.getElementById('loadMoreSection') as HTMLDivElement;
        if (loadMoreSection) {
            loadMoreSection.style.display = 'none';
        }
    }

    private showMovieGridSections(): void {
        const loadMoreSection = document.getElementById('loadMoreSection') as HTMLDivElement;
        if (loadMoreSection && this.currentMovies.length >= 20) {
            loadMoreSection.style.display = 'block';
        }
    }

    public returnToMovieGrid(): void {
        // Restore the movie grid view
        this.displayMovies(this.currentMovies);
        this.showMovieGridSections();
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
    if (window.movieApp) {
        window.movieApp.showMovieDetails(movieId);
    }
};

(window as any).returnToMovieGrid = () => {
    if (window.movieApp) {
        window.movieApp.returnToMovieGrid();
    }
};

// Initialize the app when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
    const userService = new UserService();
    
    // Verify that user is created before initializing the app
    if (userService.isCreated()) {
        window.movieApp = new MovieApp();
    } else {
        // Redirect to login if user is not created
        window.location.href = 'index.html';
    }
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
        returnToMovieGrid: () => void;
    }
}
