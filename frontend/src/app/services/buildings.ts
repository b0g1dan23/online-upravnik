import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BuildingsShorthand } from '../pages/login/login';

@Injectable({
  providedIn: 'root'
})
export class BuildingsService {
  private authURL = `http://localhost:8080/buildings`;

  constructor(private http: HttpClient) { }

  getBuildingsList() {
    return this.http.get<BuildingsShorthand[]>(`${this.authURL}/list`);
  }
}
