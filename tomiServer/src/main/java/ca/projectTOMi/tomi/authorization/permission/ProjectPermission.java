package ca.projectTOMi.tomi.authorization.permission;

/**
 * List of Permissions associated with {@link ca.projectTOMi.tomi.model.Project}s.
 *
 * @author Karol Talbot
 * @version 1
 */
public enum ProjectPermission {
	READ,
	WRITE,

	// Entry
	EVALUATE_ENTRIES,

	// Expense
	CREATE_EXPENSE,
	DELETE_EXPENSE,

	// Budget
	READ_BUDGET
}
