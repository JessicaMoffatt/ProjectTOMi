package ca.projectTOMi.tomi.model;

import java.time.LocalDate;
import lombok.Data;
@Data
public class ProductivityReportLine {
  private LocalDate date;
  private UserAccount userAccount;
  private UnitType unitType;
  private Double time;
  private Double quantity;
  private Double normalizedValues;

  public ProductivityReportLine(LocalDate date, UserAccount userAccount, UnitType unitType, Double time, Double quantity){
    this.date = date;
    this.userAccount = userAccount;
    this.unitType = unitType;
    this.time = time;
    this.quantity = quantity == 0 ? 0 : quantity;
    this.normalizedValues = unitType.getWeight();
  }
}
