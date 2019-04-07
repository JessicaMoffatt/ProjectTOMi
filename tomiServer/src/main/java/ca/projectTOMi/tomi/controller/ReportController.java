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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * Rest Controller that handles HTTP requests for generating reports in the TOMi system.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@RestController
@CrossOrigin (origins = "http://localhost:4200")
public class ReportController {
	/**
	 * Provides access to the system logs for error reporting purposes.
	 */
	private final Logger logger = LoggerFactory.getLogger("Report Controller");

	/**
	 * Provides services for generating reports.
	 */
	private final ReportService reportService;

	/**
	 * Creates the ReportController.
	 *
	 * @param reportService
	 * 	Provides services for generating reports
	 */
	@Autowired
	public ReportController(final ReportService reportService) {
		this.reportService = reportService;
	}

	/**
	 * Gets a billable hours report.
	 *
	 * @return BillableHours report
	 */
	@GetMapping ("/billable_hours_report")
	public List<BillableHoursReportLine> getBillableHoursReport() {
		return this.reportService.getBillableHoursReport();
	}

	/**
	 * Gets a billable hours report in Microsoft Excel format.
	 *
	 * @return Excel file containing the billable hours report
	 */
	@GetMapping ("/billable_hours_report/xls")
	public BillableHoursReportExcelView getBillableHoursReportExcel() {
		return new BillableHoursReportExcelView(this.reportService.getBillableHoursReport());
	}

	/**
	 * Gets a budget report for the desired project.
	 *
	 * @param id
	 * 	The unique identifier for the project
	 *
	 * @return Budget report for the project
	 */
	@GetMapping ("/projects/{id}/budget_report")
	public BudgetReport getBudgetReport(@PathVariable final String id) {
		return this.reportService.getBudgetReport(id);
	}

	/**
	 * Gets a productivity report for the specified UserAccount.
	 *
	 * @param id
	 * 	unique identifier for the UserAccount
	 *
	 * @return productivity report for the specified UserAccount
	 */
	@GetMapping ("/user_accounts/{id}/productivity_report")
	public List<ProductivityReportLine> getProductivityReport(@PathVariable final Long id) {
		return this.reportService.getProductivityReport(id);
	}

	/**
	 * Gets a Microsoft Excel file containing the productivity report for the specified UserAccount.
	 *
	 * @param id
	 * 	The unique identifier for the UserAccount
	 *
	 * @return Excel file containing the productivity report for the specified UserAccount
	 */
	@GetMapping ("/user_accounts/{id}/productivity_report/xls")
	public ProductivityReportExcelView getProductivityReportExcel(@PathVariable final Long id) {
		return new ProductivityReportExcelView(this.reportService.getProductivityReport(id));
	}

	/**
	 * Gets a data dump report.
	 *
	 * @return A data dump report
	 */
	@GetMapping ("/data_dump_report")
	public List<DataDumpReportLine> getDataDumpReport() {
		return this.reportService.getDataDumpReport();
	}

	/**
	 * Gets a data dump report in a Microsoft Excel file.
	 *
	 * @return Excel file containing a data dump report
	 */
	@GetMapping ("/data_dump_report/xls")
	public DataDumpReportExcelView getDataDumpReportExcel() {
		return new DataDumpReportExcelView(this.reportService.getDataDumpReport());
	}

	/**
	 * Informs the client that an exception has occurred. In order to keep the server inner workings
	 * private a generic 400 bad request is used.
	 *
	 * @param e
	 * 	The exception that had occurred
	 *
	 * @return A 400 Bad Request Response
	 */
	@ExceptionHandler ({Exception.class})
	public ResponseEntity<?> handleExceptions(final Exception e) {
		this.logger.warn("Report Exception: " + e.getClass());
		return ResponseEntity.status(400).build();
	}
}
