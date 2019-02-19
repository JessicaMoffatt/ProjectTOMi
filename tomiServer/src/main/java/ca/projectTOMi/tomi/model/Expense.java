package ca.projectTOMi.tomi.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.MapKeyColumn;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

/**
 * An Expense is anything other than a user's billable hours that is being charged towards a {@link
 * Project}'s budget.
 *
 * @author Karol Talbot
 * @version 1
 */
@Entity
@Data
public final class Expense {
	/**
	 * Unique identifier for this Expense.
	 */
	@Id
	@GeneratedValue (generator = "expense_sequence")
	@SequenceGenerator (
		name = "expense_sequence",
		sequenceName = "expense_sequence",
		allocationSize = 1
	)
	private Long id;

	/**
	 * The {@link Project} this Expense belongs to.
	 */
	@ManyToOne
	@MapKeyColumn (name = "id")
	private Project project;

	/**
	 * The dollar value of this Expense multiplied by 100 to remove decimals.
	 */
	@Min (0)
	private Long amount;

	/**
	 * Notes about this Expense.
	 */
	@NotBlank
	private String notes;

	/**
	 * If this Expense is active.
	 */
	@JsonIgnore
	@NotNull
	private boolean active;
}
