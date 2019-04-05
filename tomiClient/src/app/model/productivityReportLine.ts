import {UserAccount} from "./userAccount";
import {UnitType} from "./unitType";

/**
 * A ProductivityReportLine represents one line of a productivity report.
 *
 * @author Jessica Moffatt
 * @version 1.0
 */
export class ProductivityReportLine {
  date: string;
  userAccount: UserAccount;
  unitType: UnitType;
  time: number;
  quantity: number;
  normalizedValue: number;

  constructor() {
    this.date = "";
    this.userAccount = null;
    this.unitType = null;
    this.time = 0;
    this.quantity = 0;
    this.normalizedValue = 0;
  }

  /**
   * Method used to compare two ProductivityReportLines by their date.
   * @param first The first ProductivityReportLine to compare.
   * @param second The second ProductivityReportLine to compare.
   */
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

  /**
   * Method used to compare two ProductivityReportLines by their UserAccount.
   * @param first The first ProductivityReportLine to compare.
   * @param second The second ProductivityReportLine to compare.
   */
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

  /**
   * Method used to compare two ProductivityReportLines by their UnitType.
   * @param first The first ProductivityReportLine to compare.
   * @param second The second ProductivityReportLine to compare.
   */
  public static compareUnitType(first: ProductivityReportLine, second:ProductivityReportLine){
    if ((first.unitType.name) < (second.unitType.name)) {
      return -1;
    }
    else if ((first.unitType.name) > (second.unitType.name))
    {
      return 1;
    }
    return 0;
  }
}
