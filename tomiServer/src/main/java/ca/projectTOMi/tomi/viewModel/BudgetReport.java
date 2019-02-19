package ca.projectTOMi.tomi.viewModel;

import java.time.LocalDate;
import ca.projectTOMi.tomi.model.Project;
import lombok.Data;
@Data
public class BudgetReport {
  private LocalDate date;
  private Long budget;
  private Long hourCost;
  private Long expenseCost;
  private Project project;

  public BudgetReport(Double hours, Long expenseCost, Project project){
    this.date = LocalDate.now();
    this.budget = project.getBudget();
    this.expenseCost = expenseCost;
    Double hourCostDouble = hours * project.getBillableRate();
    this.hourCost = hourCostDouble.longValue();
    this.project = project;
  }
}
