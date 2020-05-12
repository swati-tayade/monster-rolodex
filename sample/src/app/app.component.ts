import { Component } from '@angular/core';
import { Book } from './book';
import { BookService } from './book.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sample';
  //softBook: Observable<Book[]>;
  favBook: Observable<string>;
  constructor(private bookService: BookService) {
  }
  ngOnInit() {
    //this.getBook();
    this.getBookByMap();
  }
  // getBook() {
  //   this.softBook = this.bookService.getBooks();
  // }
  getBookByMap() {
    this.favBook = this.bookService.getBooksByMap(100).map(book => 'Name:' + book.name);
  }
}
