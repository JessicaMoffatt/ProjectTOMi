package ca.projectTOMi.tomi.controller;

import java.util.List;
import ca.projectTOMi.tomi.viewModel.BillableHoursReportExcelView;
import ca.projectTOMi.tomi.viewModel.BillableHoursReportLine;
import ca.projectTOMi.tomi.viewModel.BudgetReport;
import ca.projectTOMi.tomi.viewModel.DataDumpReportExcelView;
import ca.projectTOMi.tomi.viewModel.DataDumpReportLine;
import ca.projectTOMi.tomi.viewModel.ProductivityReportExcelView;
import ca.projectTOMi.tomi.viewModel.ProductivityReportLine;
import ca.projectTOMi.tomi.service.ReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReportController {
  private final Logger logger = LoggerFactory.getLogger("Report Controller");
  private final ReportService reportService;

  @Autowired
  public ReportController(ReportService reportService) {
    this.reportService = reportService;
  }

  @GetMapping("/billable_hours_report")
  public List<BillableHoursReportLine> getBillableHoursReport(){
    return reportService.getBillableHoursReport();
  }

  @GetMapping("/billable_hours_report/xls")
  public BillableHoursReportExcelView getBillableHoursReportExcel(){
    return new BillableHoursReportExcelView(reportService.getBillableHoursReport());
  }

  @GetMapping("/projects/{id}/budget_report")
  public BudgetReport getBudgetReport(@PathVariable String id){
    return reportService.getBudgetReport(id);
  }

  @GetMapping("/user_accounts/{id}/productivity_report")
  public List<ProductivityReportLine> getProductivityReport(@PathVariable Long id){
    return reportService.getProductivityReport(id);
  }

  @GetMapping("/user_accounts/{id}/productivity_report/xls")
  public ProductivityReportExcelView getProductivityReportExcel(@PathVariable Long id){
    return new ProductivityReportExcelView(reportService.getProductivityReport(id));
  }

  @GetMapping("/data_dump_report")
  public List<DataDumpReportLine> getDataDumpReport(){
    return reportService.getDataDumpReport();
  }

  @GetMapping("/data_dump_report/xls")
  public DataDumpReportExcelView getDataDumpReportExcel(){
    return new DataDumpReportExcelView(reportService.getDataDumpReport());
  }

  @ExceptionHandler({Exception.class})
  public ResponseEntity<?> handleExceptions(Exception e){
    logger.warn("Report Exception: " + e.getClass());
    return ResponseEntity.status(400).build();
  }
}
