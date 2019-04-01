import {Injectable} from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Client} from "../model/client";
import {collectExternalReferences} from "@angular/compiler";
import {UserAccount} from "../model/userAccount";
import {Project} from "../model/project";
import {ErrorService} from "./error.service";

/**
 * Clients service provides services relates to Clients.
 * @author James Andrade
 * @version 1.0
 */

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  /** The URL for accessing projects.*/
  private clientsUrl = 'http://localhost:8080/clients';

  /** tracks which project is selectedProject in project-panel component and manage-project modal */
  selected: Client;

  /** used to pass list to project related components */
  clients: BehaviorSubject<Array<Client>> = new BehaviorSubject<Array<Client>>([]);

  constructor(private http: HttpClient,
              private errorService: ErrorService) {
    this.initializeClients();
  }

  /**
   * used to refresh the list of clients used by the components.
   */
  initializeClients() {
    this.getClients().forEach(client => {
      this.clients = new BehaviorSubject<Array<Client>>(client);
    });
  }


  /**
   * Gets all clients.
   */
  getClients(): Observable<Array<Client>> {
    return this.http.get(`${this.clientsUrl}`)
      .pipe(catchError(this.errorService.handleError<Client[]>()))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.clients as Client[];
        } else {
          return [];
        }
      }))
  }


  /**
   * @author James Andrade
   * returns the client if they exist, otherwise null
   * @param clientName the name of the client being searched for
   */
  getClientByName(clientName: string): Client {
    for (let c of this.clients.value) {
      if (c.name === clientName) {
        return c as Client;
      }
    }
    return null;
  }


  /**
   * Saves a specified client by performing an HTTP post.
   *
   * @param client the client to be created/updated.
   */
  save(client: Client) {
    return this.http.post<Client>(this.clientsUrl, JSON.stringify(client), httpOptions).toPromise()
      .then(response => {
        return response as Client
      })
      .catch(() => {
        this.errorService.handleError();
      });
  }
}
