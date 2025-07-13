import { Movie } from "./movie";

export interface MoviePage{
    movieList:Movie[];
    page:number;
    total_pages:number;
    total_results:number;
}