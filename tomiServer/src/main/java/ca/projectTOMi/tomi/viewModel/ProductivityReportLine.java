package ca.projectTOMi.tomi.viewModel;

import java.time.LocalDate;
import ca.projectTOMi.tomi.model.UnitType;
import ca.projectTOMi.tomi.model.UserAccount;
import lombok.Data;

/**
 * The class represents a single line of a bigger productivity report. Each line represent a
 * quantity of unit type constructed over a period of time for a single user over a single reporting
 * period.
 *
 * @author Karol Talbot
 * @version 1
 */
@Data
public class ProductivityReportLine {
	/**
	 * The date of the reporting period.
	 */
	private LocalDate date;

	/**
	 * The UserAccount associated with this ProductivityReportLine.
	 */
	private UserAccount userAccount;

	/**
	 * The UnitType associated with this ProductivityReportLine.
	 */
	private UnitType unitType;

	/**
	 * The total amount of time spent by the reporting user on the associated unit type.
	 */
	private Double time;

	/**
	 * The total quantity created by the reporting user of the associated unit type.
	 */
	private Double quantity;

	/**
	 * The normalized productivity of the user against a typical work week.
	 */
	private Double normalizedValue;

	/**
	 * Creates a new ProductivityReportLine from the provided information.
	 *
	 * @param date
	 * 	The reporting period
	 * @param userAccount
	 * 	The account associated with the line
	 * @param unitType
	 * 	The unitType associated with the line
	 * @param time
	 * 	The total time spent on the unitType during the reporting period
	 * @param quantity
	 * 	The total quantity produced during the reporting period
	 */
	public ProductivityReportLine(final LocalDate date,
	                              final UserAccount userAccount,
	                              final UnitType unitType,
	                              final Double time,
	                              final Double quantity) {
		this.date = date;
		this.userAccount = userAccount;
		this.unitType = unitType;
		this.time = time;
		this.quantity = quantity;
		this.normalizedValue = this.quantity * (unitType.getWeight() / 37.5) * 100;
	}
}
