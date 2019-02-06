package ca.projectTOMi.tomi.model;

import java.time.LocalDate;
import lombok.Data;

@Data
public class BillableHoursReportLine {
  private LocalDate date;
  private double billableHours;
  private double nonbillableHours;
  private UserAccount userAccount;
  private Project project;

  public BillableHoursReportLine(LocalDate date, double billableHours, double nonbillableHours, UserAccount userAccount, Project project) {
    this.date = date;
    this.billableHours = billableHours;
    this.nonbillableHours = nonbillableHours;
    this.userAccount = userAccount;
    this.project = project;
  }
}
