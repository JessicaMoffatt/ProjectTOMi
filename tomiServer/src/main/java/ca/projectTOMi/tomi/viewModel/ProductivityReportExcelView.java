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
public class ProductivityReportExcelView extends AbstractXlsView {
	private final List<ProductivityReportLine> report;

	public ProductivityReportExcelView(final List<ProductivityReportLine> report) {
		super();
		this.report = report;
	}

	@Override
	protected void buildExcelDocument(final Map<String, Object> map, final Workbook workbook, final HttpServletRequest httpServletRequest, final HttpServletResponse httpServletResponse) throws Exception {
		httpServletResponse.setHeader("Content-Disposition", "attachment;filename=\"" + this.report.get(0).getUserAccount().getLastName() + "ProductivityReport.xls\"");
		final Sheet sheet = workbook.createSheet("Productivity Report");
		final Row header = sheet.createRow(0);
		header.createCell(0).setCellValue("Date");
		header.createCell(1).setCellValue("Team Member");
		header.createCell(2).setCellValue("Unit Type");
		header.createCell(3).setCellValue("Time");
		header.createCell(4).setCellValue("Quantity");
		header.createCell(5).setCellValue("Normalized Value");


		int rowNum = 1;
		for (final ProductivityReportLine line : this.report) {
			final Row row = sheet.createRow(rowNum++);
			row.createCell(0).setCellValue(line.getDate().toString());
			row.createCell(1).setCellValue(line.getUserAccount().getFirstName() + " " + line.getUserAccount().getLastName());
			row.createCell(2).setCellValue(line.getUnitType().getName());
			row.createCell(3).setCellValue(line.getTime());
			row.createCell(4).setCellValue(line.getQuantity());
			row.createCell(5).setCellValue(line.getNormalizedValue());
		}

	}
}
