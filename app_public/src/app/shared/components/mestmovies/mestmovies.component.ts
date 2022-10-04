import { Component, OnInit } from '@angular/core';

import { GenreService } from '../../services/genre.service';
import { MovieService } from '../../services/movie.service';

import { Genre } from '../../classes/genre';
import { Movie } from '../../classes/movie';

@Component({
  selector: 'app-mestmovies',
  templateUrl: './mestmovies.component.html',
  styleUrls: ['./mestmovies.component.css']
})
export class MESTmoviesComponent implements OnInit {

  public genres: Genre[] = [{"_id": "Any", "name": "Any", "movies": []}];
  public movies: Movie[];

  public alrt_msg: string;
  public err_msg: string;
  public data = {
    search: "",
    genre: ""
  }

  constructor(private gserv: GenreService, private mserv: MovieService) { }

  ngOnInit(): void {
    this.gserv.getGenres().then(info => {
      this.genres = info[0];
      this.genres.unshift({"_id": "Any", "name": "Any", "movies": []});
    });
    this.data.genre = this.genres[0]._id;
  }

  public search(): void {
    this.movies = [];
    if(this.data.search != undefined && this.data.search.trim() != ""
      || this.data.genre != undefined && this.data.genre.trim() != "")
      this.mserv.search(this.data.search, this.data.genre).then(info => {
        this.movies = info;
      }).catch(info => this.err_msg = this.setMsg(info));
    else this.alrt_msg = this.setMsg("Error! Do not leave all fields empty.");
  }

  private setMsg(msg: string): string {
    this.alrt_msg = "Movie not found!";
    this.err_msg = undefined;
    return msg;
  }

}
