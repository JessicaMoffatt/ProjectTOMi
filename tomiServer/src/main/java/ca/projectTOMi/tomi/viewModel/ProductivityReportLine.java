package ca.projectTOMi.tomi.viewModel;

import java.time.LocalDate;
import ca.projectTOMi.tomi.model.UnitType;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;

/**
 * @author Karol Talbot
 */
@Data
public class ProductivityReportLine {
	private LocalDate date;
	private UserAccount userAccount;
	private UnitType unitType;
	private Double time;
	private Double quantity;
	private Double normalizedValue;

	public ProductivityReportLine(final LocalDate date, final UserAccount userAccount, final UnitType unitType, final Double time, final Double quantity) {
		this.date = date;
		this.userAccount = userAccount;
		this.unitType = unitType;
		this.time = time;
		this.quantity = quantity;
		this.normalizedValue = this.quantity * (unitType.getWeight() / 37.5) * 100;
	}
}
