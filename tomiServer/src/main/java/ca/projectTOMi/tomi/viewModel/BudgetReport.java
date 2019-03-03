package ca.projectTOMi.tomi.viewModel;

import java.time.LocalDate;
import ca.projectTOMi.tomi.model.Project;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
/**
 * @author Karol Talbot
 */
@Data
public class BudgetReport {
	@JsonIgnore
	private LocalDate date;
	private Long budget;
	private Long hourCost;
	private Long expenseCost;
	private Project project;

	public BudgetReport(final Project project) {
		this.date = LocalDate.now();
		this.budget = project.getBudget();
		this.hourCost = 0L;
		this.expenseCost = 0L;
		this.project = project;
	}

	public BudgetReport(final Double hours, final Long expenseCost, final Project project) {
		this.date = LocalDate.now();
		this.budget = project.getBudget();
		this.expenseCost = expenseCost;
		final Double hourCostDouble = hours * project.getBillableRate();
		this.hourCost = hourCostDouble.longValue();
		this.project = project;
	}

	@JsonProperty("date")
	public String getDate(){
		return this.date.toString();
	}
}
