import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

const BASE_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  register(registerRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'api/register', registerRequest);
  }

  login(loginRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'login', loginRequest);
  }

  hello(): Observable<any> {
    return this.http.get(BASE_URL + 'test', {
      headers: this.createAuthorizationHeader()
    });
  }

  generateData(count: number): Observable<any> {
    return this.http.post(BASE_URL+ `generate/${count}`,{
      headers: this.createAuthorizationHeader()
    });
  }

  processData(): Observable<any> {
    return this.http.post(BASE_URL + 'processFile', {}, {
      headers: this.createAuthorizationHeader()
    });
  }

  uploadData(): Observable<any> {
    return this.http.post(BASE_URL + 'uploadData', {}, {
      headers: this.createAuthorizationHeader()
    });
  }

  private createAuthorizationHeader(): HttpHeaders | undefined {
    if (isPlatformBrowser(this.platformId)) {
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        console.log("JWT token found in local storage", jwtToken);
        return new HttpHeaders().set("Authorization", "Bearer " + jwtToken);
      } else {
        console.log("JWT token not found in local storage");
      }
    }
    return undefined; // Return undefined if not in browser
  }
}
