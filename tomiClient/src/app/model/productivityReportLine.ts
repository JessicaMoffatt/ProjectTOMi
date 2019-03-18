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
}
