package ca.projectTOMi.tomi.viewModel;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.servlet.view.document.AbstractXlsView;

public class DataDumpReportExcelView extends AbstractXlsView {
	private final List<DataDumpReportLine> report;

	public DataDumpReportExcelView(final List<DataDumpReportLine> report) {
		super();
		this.report = report;
	}

	@Override
	protected void buildExcelDocument(final Map<String, Object> map, final Workbook workbook, final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse) throws Exception {
		httpServletResponse.setHeader("Content-Disposition", "attachment;filename=\"DataDumpReport.xls\"");
		final Sheet sheet = workbook.createSheet("Report");
		final Row header = sheet.createRow(0);
		header.createCell(0).setCellValue("Date");
		header.createCell(1).setCellValue("Client");
		header.createCell(2).setCellValue("Project");
		header.createCell(3).setCellValue("Project code");
		header.createCell(4).setCellValue("Task");
		header.createCell(5).setCellValue("Hours");
		header.createCell(6).setCellValue("Billable");
		header.createCell(7).setCellValue("First name");
		header.createCell(8).setCellValue("Last name");

		int rowNum = 1;
		for (final DataDumpReportLine line : this.report) {
			final Row row = sheet.createRow(rowNum++);
			row.createCell(0).setCellValue(line.getDate().toString());
			row.createCell(1).setCellValue(line.getClientName());
			row.createCell(2).setCellValue(line.getProjectName());
			row.createCell(3).setCellValue(line.getProjectCode());
			row.createCell(4).setCellValue(line.getTask());
			row.createCell(5).setCellValue(line.getHours());
			row.createCell(6).setCellValue(line.isBillable());
			row.createCell(7).setCellValue(line.getFirstName());
			row.createCell(8).setCellValue(line.getLastName());
		}

	}
}
