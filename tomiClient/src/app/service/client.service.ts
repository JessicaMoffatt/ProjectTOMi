import {Injectable} from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Client} from "../model/client";
import {ErrorService} from "./error.service";
import {clientUrl} from "../configuration/domainConfiguration";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/**
 * ClientService is used to control the flow of data regarding clients to/from the view.
 * @author James Andrade
 * @version 1.0
 */
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  /** The list of all active Clients. */
  clients: BehaviorSubject<Array<Client>> = new BehaviorSubject<Array<Client>>([]);

  constructor(private http: HttpClient, private errorService: ErrorService) {
    this.initializeClients();
  }

  /**
   * Gets the list of all active Clients and populates them into the clients list.
   */
  initializeClients() {
    this.getClients().toPromise().then(client => {
      this.clients = new BehaviorSubject<Array<Client>>(client);
      this.sortClients();
    });
  }

  /**
   * Sorts the Clients in the clients list by ascending name.
   */
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
   * Sends a GET message to the server to retrieve all active Clients.
   */
  getClients(): Observable<Array<Client>> {
    return this.http.get(`${clientUrl}`)
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
   * Sends a GET message to the server to retrieve the Client by their ID.
   * @param id The ID of the Client to get.
   */
  getClientById(id: number) {
    return this.http.get(`${clientUrl}/${id}`).pipe(map((response: Response) => response))
      .pipe(map((data: any) => {
        if (data !== undefined) {
          return data as Client;
        } else {
          return null;
        }
      }));
  }

  /**
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
      return this.http.post<Client>(clientUrl, JSON.stringify(client), httpOptions).toPromise()
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
