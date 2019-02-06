package ca.projectTOMi.tomi.service;

import java.util.List;
import ca.projectTOMi.tomi.model.BillableHoursReportLine;
import ca.projectTOMi.tomi.persistence.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportService {
  @Autowired
  ReportRepository reportRepository;

  public List<BillableHoursReportLine> getBillableHoursReport(){
    return reportRepository.generateBillableHoursReport();
  }
}
