import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "../../../components/navbar/navbar";

@Component({
  selector: 'app-manager-layout',
  imports: [RouterOutlet, Navbar],
  templateUrl: './manager-layout.html',
})
export class ManagerLayout {

}
