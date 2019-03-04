package ca.projectTOMi.tomi.viewModel;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.servlet.view.document.AbstractXlsView;

/**
 * @author Karol Talbot
 */
public class BillableHoursReportExcelView extends AbstractXlsView {
	private final List<BillableHoursReportLine> report;

	public BillableHoursReportExcelView(final List<BillableHoursReportLine> report) {
		super();
		this.report = report;
	}

	@Override
	protected void buildExcelDocument(final Map<String, Object> map, final Workbook workbook, final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse) throws Exception {
		httpServletResponse.setHeader("Content-Disposition", "attachment;filename=\"BillableHoursReport.xls\"");
		final Sheet sheet = workbook.createSheet("Billable Hours");
		final Row header = sheet.createRow(0);
		header.createCell(0).setCellValue("Date");
		header.createCell(1).setCellValue("Billable Hours");
		header.createCell(2).setCellValue("NonBillable Hours");
		header.createCell(3).setCellValue("Name");
		header.createCell(4).setCellValue("Project");

		int rowNum = 1;
		for (final BillableHoursReportLine line : this.report) {
			final Row row = sheet.createRow(rowNum++);
			row.createCell(0).setCellValue(line.getDate().toString());
			row.createCell(1).setCellValue(line.getBillableHours());
			row.createCell(2).setCellValue(line.getNonbillableHours());
			row.createCell(3).setCellValue(line.getUserAccount().getFirstName() + " " + line.getUserAccount().getLastName());
			row.createCell(4).setCellValue(line.getProject().getProjectName());
		}
	}
}
