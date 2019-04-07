import {Injectable} from '@angular/core';
import {Entry} from "../model/entry";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Team} from "../model/team";
import {entryUrl} from "../configuration/domainConfiguration";
import {ErrorService} from "./error.service";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

/**
 * EntryService is used to control the flow of data regarding entries to/from the view.
 *
 * @author Jessica Moffatt
 * @version 2.0
 */
@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(private http: HttpClient, private errorService: ErrorService) {
  }

  /**
   * Saves a specified Entry. If the entry is new (ID of -1) an HTTP POST is performed,
   * else a PUT is performed to update the existing Entry.
   * @param entry The Entry to update/create.
   */
  async save(entry: Entry) {
    let tempEntry: Entry = null;
    if (entry.id === -1) {
      await this.http.post<Entry>(entryUrl, JSON.stringify(entry), httpOptions).toPromise()
        .then(response => {
          tempEntry = response;
          return response;
        }).catch(() => {
          this.errorService.displayError();
          return null;
        });
    } else if (entry.id >= 1) {
      const url = entry._links["update"];
      await this.http.put<Entry>(url["href"], JSON.stringify(entry), httpOptions).toPromise()
        .then((response) => {
          tempEntry = response;
          return response;
        }).catch(() => {
          this.errorService.displayError();
          return null;
        });
    }
    return tempEntry;
  }

  /**
   * Copies the specified entry.
   * @param entry The entry to copy.
   */
  async copy(entry: Entry) {
    let tempEntry: Entry = null;
    const url = entry._links["copy"];
    await this.http.post<Entry>(url["href"], null, httpOptions).toPromise().then(response => {
      tempEntry = response;
      return response;
    }).catch(() => {
      this.errorService.displayError();
      return null;
    });
    return tempEntry;
  }

  /**
   * Deletes the specified Entry.
   * @param entry The Entry to delete.
   */
  delete(entry: Entry) {
    const url = entry._links["delete"];
    this.http.delete(url["href"], httpOptions).toPromise()
      .then((response) => {
        return response as Team
      })
      .catch(() => this.errorService.displayError());
  }
}

