package ca.projectTOMi.tomi.controller;

import java.util.List;
import ca.projectTOMi.tomi.model.BillableHoursReportLine;
import ca.projectTOMi.tomi.model.BudgetReport;
import ca.projectTOMi.tomi.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReportController {
  @Autowired
  ReportService reportService;

  @GetMapping("billablehours")
  public List<BillableHoursReportLine> getBillableHoursReport(){
    return reportService.getBillableHoursReport();
  }

  @GetMapping("projects/{id}/budget_report")
  public BudgetReport getBudgetReport(@PathVariable String id){
    return reportService.getBudgetReport(id);
  }
}
