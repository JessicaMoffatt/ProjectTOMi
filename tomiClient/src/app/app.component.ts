import {Component, OnInit} from '@angular/core';
import {BsLocaleService, defineLocale, enGbLocale, setTheme} from "ngx-bootstrap";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'static';

  constructor(private localeService: BsLocaleService){
    defineLocale('en-gb', enGbLocale);
  }

  ngOnInit(){
    this.localeService.use('en-gb');
  }
}
