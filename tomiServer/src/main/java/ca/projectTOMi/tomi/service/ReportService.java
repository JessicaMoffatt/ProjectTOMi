package ca.projectTOMi.tomi.service;

import java.util.List;
import ca.projectTOMi.tomi.model.Entry;
import ca.projectTOMi.tomi.viewModel.BillableHoursReportLine;
import ca.projectTOMi.tomi.viewModel.BudgetReport;
import ca.projectTOMi.tomi.viewModel.DataDumpReportLine;
import ca.projectTOMi.tomi.viewModel.ProductivityReportLine;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Provides services generating reports.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@Service
public class ReportService {
	/**
	 * Repository for constructing reports from the database.
	 */
	private final ReportRepository reportRepository;

	/**
	 * Services for maintaining business logic surrounding {@link Project}s.
	 */
	private final ProjectService projectService;

	/**
	 * Services for maintaining business logic surrounding {@link UserAccount}s.
	 */
	private final UserAccountService userAccountService;

	/**
	 * Services for maintaining business logic surrounding {@link ca.projectTOMi.tomi.model.Timesheet}s
	 * and {@link Entry}.
	 */
	private final EntryService entryService;

	/**
	 * Creates the Report Service.
	 *
	 * @param reportRepository
	 * 	Repository for generating reports
	 * @param projectService
	 * 	Service for maintaining Projects
	 * @param userAccountService
	 * 	Service for maintaining UserAccounts
	 * @param entryService
	 * 	Service for maintaining Entry and Timesheets
	 */
	@Autowired
	public ReportService(final ReportRepository reportRepository,
	                     final ProjectService projectService,
	                     final UserAccountService userAccountService,
	                     final EntryService entryService) {
		this.reportRepository = reportRepository;
		this.projectService = projectService;
		this.userAccountService = userAccountService;
		this.entryService = entryService;
	}

	/**
	 * Gets a billable hours report from the database.
	 *
	 * @return a billable hours report
	 */
	public List<BillableHoursReportLine> getBillableHoursReport() {
		return this.reportRepository.generateBillableHoursReport();
	}

	/**
	 * Gets a budget report for the provided project.
	 *
	 * @param projectId
	 * 	the unique identifier for the project
	 *
	 * @return BudgetReport for the provided project
	 */
	public BudgetReport getBudgetReport(final String projectId) {
		final Project project = this.projectService.getProjectById(projectId);
		final BudgetReport report = this.reportRepository.generateBudgetReport(project);
		for (final Entry e : this.entryService.getEntriesByProject(project)) {
			report.setBillableHours(report.getBillableHours() + (e.getTask().isBillable() ? e.getTotalHours() : 0));
			report.setNonBillableHours(report.getNonBillableHours() + (e.getTask().isBillable() ? 0 : e.getTotalHours()));
		}
		return report;
	}

	/**
	 * Gets Productivity report for the provided user.
	 *
	 * @param userAccountId
	 * 	The unique identifier for the user
	 *
	 * @return Productivity report for the provided user
	 */
	public List<ProductivityReportLine> getProductivityReport(final Long userAccountId) {
		final UserAccount userAccount = this.userAccountService.getUserAccount(userAccountId);
		return this.reportRepository.generateProductivityReport(userAccount);
	}

	/**
	 * Generates a data dump from the database.
	 *
	 * @return data dump report
	 */
	public List<DataDumpReportLine> getDataDumpReport() {
		return this.reportRepository.generateDataDumpReport();
	}
}
