import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Client} from "../model/client";
import {collectExternalReferences} from "@angular/compiler";
import {UserAccount} from "../model/userAccount";
import {Project} from "../model/project";

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

  /** The URL for accessing user accounts.
   private userAccountProjectsUrl = 'http://localhost:8080/user_accounts/'; */

  /** tracks which project is selected in project-panel component and manage-project modal */
  selected: Client;

  /** used to pass list to project related components */
  clients: BehaviorSubject<Array<Client>>;

  constructor(private http: HttpClient) {
    this.initializeProjects();
  }

  initializeProjects() {
    this.getClients().forEach( client => {
      this.clients = new BehaviorSubject<Array<Client>>(client);
      //this.sortUserAccounts();
    });
  }

  /**
   * Gets all projects.
   */
  getClients(): Observable<Array<Client>> {
    return this.http.get(`${this.clientsUrl}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data._embedded !== undefined) {
          return data._embedded.clients as Client[];
        } else {
          return [];
        }
      }));
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
   * sets the selected project that will be used in project-panel and manage-projects component
   * added by: James Andrade
   * @param project the project to be stored as 'selected'
   */
  setSelected(client: Client) {
    this.selected = client;
  }


  /**
   * Gets a project with the specified ID.
   * @param id The ID of the project to get.
   */

   getClientById(id:number){
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
   * returns the id if it is within the observable, otherwise -1
   * @param clientName the client name to be searched for
   */
  getClientByName(clientName: string): Client {

        for (let c of this.clients.value) {
          if (c.name === clientName) {
            return c;
          }
        }
        return null;
  }

  //TODO add error handling!!
  /**
   * Saves a specified client. If the team is new (ID of -1) an HTTP POST is performed, else a PUT is performed to update the existing team.
   * @param team The team to update/create.
   */
  /**
   * Saves a specified UserAccount. If the UserAccount is new (id = -1), an HTTP POST is performed, else an HTTP PUT is performed to update the existing UserAccount.
   *
   * @param account The UserAccount to be created/updated.
   */
  async save(client: Client) {

    if (client.id === -1) {
      await this.http.post<UserAccount>(this.clientsUrl, JSON.stringify(client), httpOptions).toPromise().then(response => {

       // this.refreshClients();
      }).catch((error: any) => {
        //TODO Add an error display
      });
    } else {
      const url = client._links["update"];
      this.http.put<UserAccount>(url["href"], JSON.stringify(client), httpOptions).toPromise().then(response => {

      //  this.refreshClients();
      }).catch((error: any) => {
        //TODO Add an error display
      });
    }
  }

}

