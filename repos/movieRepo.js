// MovieRepo class converted to JavaScript

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NDliZWZiOGViNzRkZDVjMDVmZTg1ZmMwNGJkZWFlZCIsIm5iZiI6MTc1MTgyOTAzOS43OTksInN1YiI6IjY4NmFjYTJmOGFmNjE1YzA0ZDlhNDExMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.48kThTWibmI2tbh7Dw_1q3kOLogX9mKZQ4zswLT07AY'
    }
  };
  

export class MovieRepo{
    async getMovieList(page){
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`, options);
        const data = await response.json();
        return data;
    }
    async getMovieDetails(id){
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListByGenre(genreId){
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListBySearch(search){
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${search}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListByActor(actorId){
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_people=${actorId}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }   
    async getMovieListByDirector(directorId){
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_people=${directorId}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListByWriter(writerId){
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_people=${writerId}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListByProducer(producerId){
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_people=${producerId}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListByStudio(studioId){
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_companies=${studioId}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListByCountry(countryId){
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_countries=${countryId}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }   
    async getMovieListByYear(year){
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
    async getMovieListByRating(rating){
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?vote_average.gte=${rating}&language=en-US&page=1`, options);
        const data = await response.json();
        return data;
    }
} 