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

}
