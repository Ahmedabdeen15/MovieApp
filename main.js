import { MovieService } from "./services/movieService.js";
import { MoviePage } from "./models/moviePage.js";
import { Movie } from "./models/movie.js";

// Initialize the movie service
const movieService = new MovieService();

// Example function to demonstrate the service usage
async function demonstrateMovieService() {
    try {
        console.log("🎬 Movie Service Demo");
        console.log("=====================");

        // Example 1: Get multiple movie pages on demand
        console.log("\n1. Fetching 3 pages of top-rated movies...");
        const moviePages = await movieService.getMoviePagesOnDemand(1, 3);
        console.log(`✅ Fetched ${moviePages.length} pages`);
        console.log(`📊 Total movies across all pages: ${moviePages.reduce((total, page) => total + page.movieList.length, 0)}`);

        // Example 2: Get all movies as a flat array
        console.log("\n2. Getting all movies from 2 pages as a flat array...");
        const allMovies = await movieService.getAllMoviesFromPages(1, 2);
        console.log(`✅ Fetched ${allMovies.length} movies total`);

        // Example 3: Search for movies
        console.log("\n3. Searching for 'Avengers' movies...");
        const searchResults = await movieService.getMoviePagesBySearchOnDemand("Avengers", 2);
        console.log(`✅ Found ${searchResults.length} pages of search results`);

        // Example 4: Get movies by year
        console.log("\n4. Getting movies from 2023...");
        const yearResults = await movieService.getMoviePagesByYearOnDemand(2023, 2);
        console.log(`✅ Found ${yearResults.length} pages of 2023 movies`);

        // Example 5: Get movies by rating
        console.log("\n5. Getting movies with rating >= 8.0...");
        const ratingResults = await movieService.getMoviePagesByRatingOnDemand(8.0, 2);
        console.log(`✅ Found ${ratingResults.length} pages of high-rated movies`);

        // Example 6: Using filters
        console.log("\n6. Using custom filters...");
        const filterResults = await movieService.getMoviePagesWithFiltersOnDemand({
            searchTerm: "Batman",
            minRating: 7.0
        }, 2);
        console.log(`✅ Found ${filterResults.length} pages with custom filters`);

        console.log("\n🎉 All examples completed successfully!");

    } catch (error) {
        console.error("❌ Error in movie service demo:", error);
    }
}

// Example function for lazy loading (on-demand loading)
async function loadMoviesOnDemand(pageNumber, pageCount = 1) {
    console.log(`🔄 Loading ${pageCount} page(s) starting from page ${pageNumber}...`);
    
    try {
        const pages = await movieService.getMoviePagesOnDemand(pageNumber, pageCount);
        console.log(`✅ Successfully loaded ${pages.length} page(s)`);
        return pages;
    } catch (error) {
        console.error(`❌ Failed to load pages:`, error);
        throw error;
    }
}

// Example function for infinite scroll simulation
async function simulateInfiniteScroll() {
    console.log("\n🔄 Simulating infinite scroll...");
    
    let currentPage = 1;
    const pagesPerLoad = 2;
    
    try {
        for (let load = 1; load <= 3; load++) {
            console.log(`\n📄 Load ${load}: Fetching pages ${currentPage} to ${currentPage + pagesPerLoad - 1}`);
            
            const newPages = await loadMoviesOnDemand(currentPage, pagesPerLoad);
            
            console.log(`📊 Loaded ${newPages.length} pages with ${newPages.reduce((total, page) => total + page.movieList.length, 0)} movies`);
            
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            currentPage += pagesPerLoad;
        }
        
        console.log("\n✅ Infinite scroll simulation completed!");
        
    } catch (error) {
        console.error("❌ Error in infinite scroll simulation:", error);
    }
}

// Export functions for use in other modules
export { movieService, demonstrateMovieService, loadMoviesOnDemand, simulateInfiniteScroll };

// Run the demo if this file is executed directly
if (typeof window !== 'undefined') {
    // Browser environment
    window.addEventListener('DOMContentLoaded', () => {
        console.log("🎬 Movie Service ready for use!");
        // Uncomment the line below to run the demo automatically
        // demonstrateMovieService();
    });
} else {
    // Node.js environment
    console.log("🎬 Movie Service ready for use!");
    // Uncomment the line below to run the demo automatically
    // demonstrateMovieService();
} 