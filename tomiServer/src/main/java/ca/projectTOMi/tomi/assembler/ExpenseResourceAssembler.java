package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.net.URISyntaxException;
import ca.projectTOMi.tomi.authorization.wrapper.ProjectAuthLinkWrapper;
import ca.projectTOMi.tomi.controller.ExpenseController;
import ca.projectTOMi.tomi.model.Expense;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 * ExpenseResourceAssembler is responsible for creating a standard resource for {@link Expense}
 * objects.
 *
 * @author Karol Talbot
 * @version 1
 */
@Component
public final class ExpenseResourceAssembler implements ResourceAssembler<ProjectAuthLinkWrapper<Expense>, Resource<Expense>> {
	/**
	 * Provides access to the logs for error reporting.
	 */
	private final Logger logger = LoggerFactory.getLogger("Expense Assembler");

	/**
	 * Converts a Expense instance into a Resource instance with HATEOAS links based on the requesting
	 * user's {@link ca.projectTOMi.tomi.authorization.policy.ProjectAuthorizationPolicy}s.
	 *
	 * @param projectAuthLinkWrapper
	 * 	a {@link ca.projectTOMi.tomi.model.Expense} object paired with the {@link
	 * 	ca.projectTOMi.tomi.authorization.manager.AuthManager} created for the request
	 *
	 * @return Resource of the provided Expense
	 */
	@Override
	public Resource<Expense> toResource(final ProjectAuthLinkWrapper<Expense> projectAuthLinkWrapper) {
		final Expense expense = projectAuthLinkWrapper.getModelObject();
		final Resource<Expense> resource = new Resource<>(expense,
			linkTo(methodOn(ExpenseController.class).getExpense(expense.getId(), expense.getProject().getId(), projectAuthLinkWrapper.getManager())).withSelfRel(),
			linkTo(methodOn(ExpenseController.class).getActiveExpenses(expense.getProject().getId(), projectAuthLinkWrapper.getManager())).withRel("expenses"));

		final Link deleteLink = linkTo(methodOn(ExpenseController.class).setExpenseInactive(expense.getId(), expense.getProject().getId())).withRel("delete");
		resource.add(deleteLink);
		try {
			final Link updateLink = linkTo(methodOn(ExpenseController.class).updateExpense(expense.getId(), expense.getProject().getId(), expense, projectAuthLinkWrapper.getManager())).withRel("update");
			resource.add(updateLink);
		} catch (final URISyntaxException e) {
			this.logger.warn(e.getMessage());
		}

		return resource;
	}
}
