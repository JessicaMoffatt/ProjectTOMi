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
 * @author Karol Talbot
 */
@Service
public class ReportService {
	private final ReportRepository reportRepository;
	private final ProjectService projectService;
	private final UserAccountService userAccountService;
	private final EntryService entryService;

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

	public List<BillableHoursReportLine> getBillableHoursReport() {
		return this.reportRepository.generateBillableHoursReport();
	}

	public BudgetReport getBudgetReport(final String projectId) {
		final Project project = this.projectService.getProjectById(projectId);
		final BudgetReport report = this.reportRepository.generateBudgetReport(project);
		for(final Entry e: this.entryService.getEntriesByProject(project)){
			report.setBillableHours(report.getBillableHours() + (e.getTask().isBillable()? e.getTotalHours() : 0));
			report.setNonBillableHours(report.getNonBillableHours() + (e.getTask().isBillable()? 0 : e.getTotalHours()));
		}
		return report;
	}

	public List<ProductivityReportLine> getProductivityReport(final Long userAccountId) {
		final UserAccount userAccount = this.userAccountService.getUserAccount(userAccountId);
		return this.reportRepository.generateProductivityReport(userAccount);
	}

	public List<DataDumpReportLine> getDataDumpReport() {
		return this.reportRepository.generateDataDumpReport();
	}
}
