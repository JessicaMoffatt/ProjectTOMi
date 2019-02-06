package ca.projectTOMi.tomi.model;

import java.time.LocalDate;
import lombok.Data;
@Data
public class BudgetReport {
  private LocalDate date;
  private Long total;
  private Long hourCost;
  private Long expenseCost;
  private Project project;

  public BudgetReport(Long hourCost, Long expenseCost, Project project){
    this.date = LocalDate.now();
    this.total = hourCost + expenseCost;
    this.expenseCost = expenseCost;
    this.hourCost = hourCost;
    this.project = project;
  }
}
