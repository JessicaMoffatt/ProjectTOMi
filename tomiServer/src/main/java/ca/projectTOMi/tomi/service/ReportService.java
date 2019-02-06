package ca.projectTOMi.tomi.service;

import java.util.List;
import ca.projectTOMi.tomi.model.BillableHoursReportLine;
import ca.projectTOMi.tomi.model.BudgetReport;
import ca.projectTOMi.tomi.model.Project;
import ca.projectTOMi.tomi.persistence.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportService {
  @Autowired
  ReportRepository reportRepository;
  @Autowired ProjectService projectService;

  public List<BillableHoursReportLine> getBillableHoursReport(){
    return reportRepository.generateBillableHoursReport();
  }

  public BudgetReport getBudgetReport(String projectId){
    Project project = projectService.getProjectById(projectId);
    return reportRepository.generateBudgetReport(project);
  }
}
