import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type BuildingsShorthand = {
  id: string;
  name: string;
  address: string;
}

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
