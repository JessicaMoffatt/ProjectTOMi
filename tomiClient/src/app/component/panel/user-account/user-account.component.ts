import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserAccountService} from "../../../service/user-account.service";
import {UserAccount} from "../../../model/userAccount";
import {Observable, Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit, OnDestroy {

  public selectedEventSubject: Subject<UserAccount> = new Subject<UserAccount>();

  private userSelectedSubscription: Subscription;

  private userAccount: UserAccount;

  @Input() userSelectedEvent: Observable<UserAccount>;

  @ViewChild('editUserComponent') editUserComponent : ElementRef;

  constructor(public userAccountService: UserAccountService) { }

  ngOnInit() {
    this.userSelectedSubscription = this.userSelectedEvent.subscribe((userSelected: UserAccount) => {
      this.selectedEventSubject.next(userSelected);
    });
  }

  ngOnDestroy() {
    this.userSelectedSubscription.unsubscribe();
  }

  /**
   * Passes on the request to delete a UserAccount to the UserAccountService.
   * @param userAccount UserAccount to be deleted.
   */
  delete(userAccount: UserAccount) {
    this.userAccountService.delete(userAccount);
  }

  /**
   *
   * @param userAccount
   */
  save(userAccount: UserAccount) {
    this.userAccountService.save(userAccount);
  }
}
