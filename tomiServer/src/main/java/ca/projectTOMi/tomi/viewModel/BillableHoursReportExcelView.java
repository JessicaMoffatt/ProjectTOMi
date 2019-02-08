package ca.projectTOMi.tomi.viewModel;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.servlet.view.document.AbstractXlsView;
public class BillableHoursReportExcelView extends AbstractXlsView {
  private List<BillableHoursReportLine> report;

  public BillableHoursReportExcelView(List<BillableHoursReportLine> report){
    super();
    this.report = report;
  }

  @Override
  protected void buildExcelDocument(Map<String, Object> map, Workbook workbook, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {
    httpServletResponse.setHeader("Content-Disposition", "attachment;filename=\"BillableHoursReport.xls\"");
    Sheet sheet = workbook.createSheet("Billable Hours");
    Row header = sheet.createRow(0);
    header.createCell(0).setCellValue("Date");
    header.createCell(1).setCellValue("Billable Hours");
    header.createCell(2).setCellValue("NonBillable Hours");
    header.createCell(3).setCellValue("Name");
    header.createCell(4).setCellValue("Project");

    int rowNum = 1;
    for(BillableHoursReportLine line:this.report){
      Row row = sheet.createRow(rowNum++);
      row.createCell(0).setCellValue(line.getDate().toString());
      row.createCell(1).setCellValue(line.getBillableHours());
      row.createCell(2).setCellValue(line.getNonbillableHours());
      row.createCell(3).setCellValue(line.getUserAccount().getFirstName()+" " +line.getUserAccount().getLastName());
      row.createCell(4).setCellValue(line.getProject().getProjectName());
    }

  }
}
