package ca.projectTOMi.tomi.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import lombok.Data;

/**
 * An Expense is anything other than a user's billable hours that is being charged towards a
 * {@link Project}'s budget.
 *
 * @author Karol Talbot (Updated by Iliya Kiritchkov)
 * @version 1.1
 */
@Entity
@Data
public class Expense {
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
}
