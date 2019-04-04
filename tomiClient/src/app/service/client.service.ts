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

  constructor(private http: HttpClient, private errorService: ErrorService) {
    this.initializeClients();
  }

  /**
   * used to refresh the list of clients used by the components.
   */
  initializeClients() {
    this.getClients().toPromise().then(client => {
      this.clients = new BehaviorSubject<Array<Client>>(client);
      this.sortClients();
    });
  }

  sortClients() {
    this.clients.getValue().sort((client1, client2) => {
      let name1 = client1.name.toLowerCase();
      let name2 = client2.name.toLowerCase();
      if (name1 > name2) {
        return 1;
      }
      if (name1 < name2) {
        return -1;
      }
      return 0;
    });
  }

  /**
   * Gets all clients.
   */
  getClients(): Observable<Array<Client>> {
    return this.http.get(`${this.clientsUrl}`)
      .pipe(catchError(this.errorService.handleError<Client[]>()))
      .pipe(map((data: any) => {
        if (data !== undefined && data._embedded !== undefined) {
          return data._embedded.clients as Client[];
        } else {
          return [];
        }
      }))
  }

  /**
   * Gets the projects for a specified user.
   * @param userId The ID of the user whose projects we want.

   getProjectsForUser(userId:number): Observable<Array<Project>>{
    return this.http.get(`${this.userAccountProjectsUrl}/${userId}/projects`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.projects as Project[];
        } else {
          return [];
        }
      }));
  } */

  /**
   * sets the selectedProject project that will be used in project-panel and manage-projects component
   * added by: James Andrade
   * @param project the project to be stored as 'selectedProject'
   */
  setSelected(client: Client) {
    this.selected = client;
  }


  /**
   * Gets a project with the specified ID.
   * @param id The ID of the project to get.
   */

  getClientById(id: number) {
    return this.http.get(`${this.clientsUrl}/${id}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data !== undefined) {
          return data as Client;
        } else {
          return null;
        }
      }));
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
    let newClient: boolean = true;

    this.clients.subscribe(result => {
      for (let i = 0; i < result.length; i++) {
        if (result[i].name === client.name) {
          newClient = false;
          break;
        }
      }
    });

    if (newClient === true) {
      client.id = -1;
    }

    if (client.id === -1) {
      return this.http.post<Client>(this.clientsUrl, JSON.stringify(client), httpOptions).toPromise()
        .then(response => {
          return response as Client
        })
        .catch(() => {
          //TODO Add an error display
        });
    } else {
      const url = client._links["update"];
      return this.http.put<Client>(url["href"], JSON.stringify(client), httpOptions).toPromise()
        .then(response => {
          return response as Client
        }).catch(() => {
          //TODO Add an error display
        });
    }
  }
}
