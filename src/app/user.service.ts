import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "./user";
import {isNgTemplate} from "@angular/compiler";

@Injectable(
  {providedIn: "root"}
)
export class UserService {

  private url = "http://localhost:3000/users";
  private http: HttpClient;
  constructor() {
    this.http = inject(HttpClient);
  }

  getUsers(){
    return this.http.get<User[]>(this.url);
  }
  createUser(user: User){
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post<User>(this.url, JSON.stringify(user), {headers: myHeaders});
  }
  updateUser(user: User) {
    const myHeaders = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.put<User>(this.url, JSON.stringify(user), {headers:myHeaders});
  }
  deleteUser(id: string){
    return this.http.delete<User>(this.url + "/" + id);
  }
}
