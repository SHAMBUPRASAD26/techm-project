import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  private apiUrl = environment.apiUrl + '/healthcheck';

  constructor(private http: HttpClient) {}

  checkBackendHealth(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
