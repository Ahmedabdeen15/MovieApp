import { Movie } from "../models/movie";
import { MoviePage } from "../models/moviePage";

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NDliZWZiOGViNzRkZDVjMDVmZTg1ZmMwNGJkZWFlZCIsIm5iZiI6MTc1MTgyOTAzOS43OTksInN1YiI6IjY4NmFjYTJmOGFmNjE1YzA0ZDlhNDExMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.48kThTWibmI2tbh7Dw_1q3kOLogX9mKZQ4zswLT07AY'
    }
  };
  

export class MovieRepo{
    async getMovieList(page:number):Promise<MoviePage>{
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`, options);
        const data = await response.json();
        return data;
    }
    async getMovieDetails(id:number):Promise<Movie>{
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListByGenre(genreId:number):Promise<MoviePage>{
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListBySearch(search:string):Promise<MoviePage>{
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${search}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListByActor(actorId:number):Promise<MoviePage>{
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_people=${actorId}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }   
    async getMovieListByDirector(directorId:number):Promise<MoviePage>{
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_people=${directorId}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListByWriter(writerId:number):Promise<MoviePage>{
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_people=${writerId}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListByProducer(producerId:number):Promise<MoviePage>{
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_people=${producerId}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListByStudio(studioId:number):Promise<MoviePage>{
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_companies=${studioId}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListByCountry(countryId:number):Promise<MoviePage>{
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_countries=${countryId}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }   
    async getMovieListByYear(year:number):Promise<MoviePage>{
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListByRating(rating:number):Promise<MoviePage>{
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?vote_average.gte=${rating}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
}