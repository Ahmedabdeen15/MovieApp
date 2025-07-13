export interface Movie{
    id:number;
    backdrop_path:string;
    original_language:string;
    original_title:string;
    overview:string;
    popularity:number,
    poster_path:string;
    release_date:Date;
    title:string;
    genre_ids:number[];
    vote_average:number;
    vote_count:number;
    video:boolean;
    adult:boolean;
}

/*
"results": [
    {
      "adult": false,
      "backdrop_path": "/zfbjgQE1uSd9wiPTX4VzsLi0rGG.jpg",
      https://media.themoviedb.org/t/p/w300_and_h450_bestv2/ombsmhYUqR4qqOLOxAyr5V8hbyv.jpg
      "genre_ids": [
        18,
        80
      ],
      "id": 278,
      "original_language": "en",
      "original_title": "The Shawshank Redemption",
      "overview": "Imprisoned in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.",
      "popularity": 26.2205,
      "poster_path": "/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
      "release_date": "1994-09-23",
      "title": "The Shawshank Redemption",
      "video": false,
      "vote_average": 8.712,
      "vote_count": 28535
    },
*/