export interface Movie {
    id: number;
    backdrop_path: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string; // Note: string from API
    title: string;
    genre_ids: number[];
    vote_average: number;
    vote_count: number;
    video: boolean;
    adult: boolean;
}

export interface MoviePage {
    movieList: Movie[];
    page: number;
    total_pages: number;
    total_results: number;
}
