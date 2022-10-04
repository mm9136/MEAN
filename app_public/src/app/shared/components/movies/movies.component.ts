import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { MovieService } from '../../services/movie.service';

import { Movie } from '../../classes/movie';
import { UserControlService } from '../../services/user-control.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {

  // TODO pagination

  public movies: Movie[];

  public admin: boolean;
  public alrt_msg: string;
  public err_msg: string;
  public error_msg :string;
  public count: number = 0;
  public currentPage: number = 0;
  public pag_disabled: boolean = false;

  constructor(private mserv: MovieService, private uservice: UserControlService) {
    uservice.userType$.subscribe(type => {
      if(type == "admin") {
        console.log("Movies "+type);
        this.admin = true;
      }
      else this.admin = false;
    });
  }

  ngOnInit(): void {
    this.getMovies();
    this.uservice.reloadData();
  }

  public changePage(event: PageChangedEvent): void {
    this.pag_disabled = true;
    const offset = (event.page - 1) * event.itemsPerPage;
    const limit = event.itemsPerPage;
    this.mserv.getMovies(offset, limit).then((info) => {
      this.movies = info[0];
      this.count = info[1];
      this.pag_disabled = false;
    }).catch((info) => {});
  }

  private getMovies(): void {
    this.mserv.getMovies(0, 10).then(info => {
      this.movies = info[0];
      this.count = info[1];
    }).catch(error =>{
      this.error_msg = error;
    });
  }

}
