import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BuildingsService {
  private buildingsURL = `http://localhost:8080/buildings`;

  constructor(private http: HttpClient) { }

  getList() {
    return this.http.get<{
      id: string;
      address: string;
      name: string;
    }[]>(`${this.buildingsURL}/list`);
  }
}
