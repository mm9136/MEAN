import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

import { MovieService } from '../../services/movie.service';

import { DvdMovie } from '../../classes/dvd-movie';
import { GenreService } from '../../services/genre.service';
import { Genre } from '../../classes/genre';
import { OmdbService } from '../../services/omdb.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {

  @Input() movies: Array<string>; @Input() addtodvd: boolean;
  @Output() modifyDvdMovies = new EventEmitter<string[]>();

  public err_msg: string;
  public succ_msg: string;
  public info_msg: string;
  public alrt_msg: string;
  public genres: Genre[];
  public movie: DvdMovie = {
    _id: "",
    imdb_id: "",
    title: "",
    genre: "",
    description: "",
    year: undefined
  };

  private block_change: boolean = false;
  private METHOD = "POST";

  constructor(private mserv: MovieService, private gserv: GenreService, private oserv: OmdbService) { }

  ngOnInit(): void {
    this.getGenres();
  }

  private modifyDvd(): void {
    this.modifyDvdMovies.emit(this.movies); 
  }

  public autocomplete(): void {
    var query = "";
    var send = true;
    var save: DvdMovie = { // makes sure the query is the same for db and omdb
      imdb_id: this.movie.imdb_id,
      title: this.movie.title,
      year: this.movie.year,
      description: this.movie.description
    }
    if(typeof this.movie.imdb_id != "undefined" && this.movie.imdb_id.trim() != "") {
      query+="i="+this.movie.imdb_id;
    } else if(typeof this.movie.title != "undefined" && this.movie.title.trim() != "" && typeof this.movie.year != "undefined" && this.movie.year > 0) {
      query+="t="+this.movie.title.replace(" ", "+")+"&y="+this.movie.year;
    } else if(typeof this.movie.title != "undefined" && this.movie.title.trim() != "") {
      query+="t="+this.movie.title.replace(" ", "+");
    } else {
        send = false;
        this.alrt_msg = this.setMsg("Either IMDB ID or title must be valid for autocomplete!");
    }
    if(send) {
      this.mserv.autocomplete(query).then(info => {
        if(typeof info._id == "undefined" || info._id.trim() == "") this.METHOD = "POST";
        else this.METHOD = "PUT";
        this.movie = info;
      }).catch(info => {
        if(info == "OMDB") {
          this.oserv.getMovieDetails(save).then((info) => {
            this.movie = info;
            var n = true;
            for(var g of this.genres)
              if(g.name == info.genre) {
                  n=false;
                  break;
              }
            if(n) {
              this.genres.push({_id: "new", name: info.genre, movies: []});
            }
            this.movie.genre = info.genre;
          }).catch((info) => this.err_msg = this.setMsg(info));
        } else this.err_msg = this.setMsg(info);
      });
    }
  }

  public modifyMovie(): void {
    console.log(this.METHOD);
    if(!this.block_change) {
      this.block_change = true;
      if(this.METHOD == "POST") {
        if(this.validMovie(this.movie)) {
          this.mserv.addMovie(this.movie).then(info => {
            if(info != null && this.addtodvd && this.movies.indexOf(info._id) < 0) {
              this.movies.push(info._id);
              this.succ_msg = this.setMsg("Successfully added movie to DVD.");
            } else if(info != null) this.succ_msg = this.setMsg("Successfully added movie.");
          }).catch(info => {
            this.err_msg = this.setMsg(info);
          });
        } else this.alrt_msg = this.setMsg("No fields must be left empty.");
      } else if(this.METHOD == "PUT") {
          if(this.validMovie(this.movie)) {
            if(typeof this.movie._id != "undefined" && this.movie._id.trim() != "") {
              this.mserv.modifyMovie(this.movie._id, this.movie).then(info => {
                if(info != null && this.addtodvd && this.movies.indexOf(info._id) < 0) {
                  this.movies.push(info._id);
                  this.succ_msg = this.setMsg("Successfully added movie to DVD.");
                } else if(info != null) this.succ_msg = this.setMsg("Successfully modified movie.");
              }).catch(info => {
                this.err_msg = this.setMsg(info);
              });
            }
          } else this.alrt_msg = this.setMsg("No fields must be left empty.");
      } else console.log("Error with modification method");
      this.clearMovie();
    } else this.info_msg = this.setMsg("Please wait a few seconds then try again.");
    this.block_change = false;
    this.modifyDvd();
  }

  public removeMovie(): void {
    if(!this.block_change) {
      this.block_change = true;
      if(typeof this.movie._id == "undefined" || this.movie._id.trim() == "")
        this.info_msg = this.setMsg("Please autocomplete first.");
      else {
        this.mserv.removeMovie(this.movie._id).then(() => {
          if(this.addtodvd) {
            //console.log("------------------ "+this.movies+" ");
            var i = this.movies.indexOf(this.movie._id);
            if(i < 0 && typeof this.movies != "string") this.alrt_msg = this.setMsg("Movie does not exist on DVD.");
            else {
              this.movies.splice(i, 1);
              this.succ_msg = this.setMsg("Successfully removed movie from DVD."); 
            }
          }
          this.clearMovie();
        }).catch((err) => {
          if(this.addtodvd) {
            //console.log("------------------ "+this.movies+" "+typeof this.movies+" "+this.movie._id+" "+this.movies.length);
            //this.test(this.movies, this.movie._id);
            var i = this.movies.indexOf(this.movie._id);
            if(i < 0  && typeof this.movies != "string") this.alrt_msg = this.setMsg("Movie does not exist on DVD.");
            else {
              this.movies.splice(i, 1);
              this.succ_msg = this.setMsg("Successfully removed movie from DVD."); 
            }
          } else this.alrt_msg = this.setMsg(err);
          this.clearMovie();
        });
      }
    }
    this.block_change = false;
    this.modifyDvd();
  }

  private getGenres(): void {
    this.gserv.getGenres().then(info => {
      this.genres = info[0];
    });
  }

  private validMovie(m: DvdMovie): boolean {
    if(typeof m.imdb_id != "undefined" && m.imdb_id.trim() != ""
        && typeof m.title != "undefined" && m.title.trim() != ""
        && typeof m.year != "undefined" && m.year > 0
        && typeof m.genre != "undefined" && m.genre.trim() != ""
        && typeof m.description != "undefined" && m.description.trim() != "") return true;
    else return false;
  }

  private setMsg(msg: string): string {
    this.alrt_msg = undefined;
    this.succ_msg = undefined;
    this.info_msg = undefined;
    this.err_msg = undefined;
    return msg;
  }

  private clearMovie(): void {
    this.movie = {
      _id: "",
      imdb_id: "",
      title: "",
      genre: "",
      description: "",
      year: undefined
    }
  }

}