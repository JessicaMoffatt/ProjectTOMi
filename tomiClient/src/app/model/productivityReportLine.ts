import {UserAccount} from "./userAccount";
import {UnitType} from "./unitType";

export class ProductivityReportLine {
  date: String;
  userAccount: UserAccount;
  unitType: UnitType;
  time: number;
  quantity: number;
  normalizedValue: number;

  public ProductivityReportLine() {
    this.date = "";
    this.userAccount = null;
    this.unitType = null;
    this.time = 0;
    this.quantity = 0;
    this.normalizedValue = 0;
  }

  public static compareDate(first: ProductivityReportLine, second:ProductivityReportLine){
    if (first.date < second.date) {
      return -1;
    }
    else if (first.date > second.date)
    {
      return 1;
    }
    return 0;
  }

  public static compareUser(first: ProductivityReportLine, second:ProductivityReportLine){
    if ((first.userAccount.firstName + first.userAccount.lastName) < (second.userAccount.firstName + second.userAccount.lastName)) {
      return -1;
    }
    else if ((first.userAccount.firstName + first.userAccount.lastName) > (second.userAccount.firstName + second.userAccount.lastName))
    {
      return 1;
    }
    return 0;
  }
}
