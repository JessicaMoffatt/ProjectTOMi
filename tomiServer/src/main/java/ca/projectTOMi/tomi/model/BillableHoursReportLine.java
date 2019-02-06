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

  public BillableHoursReportLine(LocalDate date, UserAccount userAccount, double billableHours, double nonbillableHours, Project project) {
    this.date = date;
    this.userAccount = userAccount;
    this.billableHours = billableHours;
    this.nonbillableHours = nonbillableHours;
    this.project = project;
  }
}
