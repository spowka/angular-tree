import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ICompany } from '../pages/company/models/organization.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  getOrganizationsData(): Observable<ICompany> {
    return this.http.get<ICompany>(`${environment.API_URL}/data`);
  }
}
