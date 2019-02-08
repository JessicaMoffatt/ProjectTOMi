package ca.projectTOMi.tomi.service;

import java.util.List;
import ca.projectTOMi.tomi.viewModel.BillableHoursReportLine;
import ca.projectTOMi.tomi.viewModel.BudgetReport;
import ca.projectTOMi.tomi.viewModel.DataDumpReportLine;
import ca.projectTOMi.tomi.viewModel.ProductivityReportLine;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportService {
  @Autowired
  ReportRepository reportRepository;
  @Autowired ProjectService projectService;
  @Autowired UserAccountService userAccountService;

  public List<BillableHoursReportLine> getBillableHoursReport(){
    return reportRepository.generateBillableHoursReport();
  }

  public BudgetReport getBudgetReport(String projectId){
    Project project = projectService.getProjectById(projectId);
    return reportRepository.generateBudgetReport(project);
  }

  public List<ProductivityReportLine> getProductivityReport(Long userAccountId){
    UserAccount userAccount = userAccountService.getUserAccount(userAccountId);
    return reportRepository.generateProductivityReport(userAccount);
  }

  public List<DataDumpReportLine> getDataDumpReport(){
    return reportRepository.generateDataDumpReport();
  }
}
