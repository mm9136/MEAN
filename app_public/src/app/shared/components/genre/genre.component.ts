import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { GenreService } from '../../services/genre.service';

import { Genre } from '../../classes/genre';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit {

  public genres: Genre[];

  public count: number = 0;
  public currentPage: number = 0;
  public pag_disabled: boolean = false;
  public error_msg :string;

  constructor(private gserv: GenreService) { }

  ngOnInit(): void {
    this.gserv.getGenres(0, 10).then(info => {
      this.genres = info[0];
      this.count = info[1];
    }).catch(error =>{
      this.error_msg = error;
    });
  }

  public changePage(event: PageChangedEvent): void {
    this.pag_disabled = true;
    const offset = (event.page - 1) * event.itemsPerPage;
    const limit = event.itemsPerPage;
    this.gserv.getGenres(offset, limit).then((info) => {
      this.genres = info[0];
      this.count = info[1];
      this.pag_disabled = false;
    }).catch((info) => {});
  }

}
