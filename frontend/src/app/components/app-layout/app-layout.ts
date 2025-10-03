import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app-layout.html',
})
export class AppLayout {

}
