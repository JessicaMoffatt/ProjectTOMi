package ca.projectTOMi.tomi.assembler;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import ca.projectTOMi.tomi.authorization.wrapper.UserAuthLinkWrapper;
import ca.projectTOMi.tomi.controller.ProjectController;
import ca.projectTOMi.tomi.controller.ReportController;
import ca.projectTOMi.tomi.controller.UserAccountController;
import ca.projectTOMi.tomi.model.UserAccount;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceAssembler;
import org.springframework.stereotype.Component;

/**
 * UserAccountResourceAssembler is responsible for creating a standard resource for {@link
 * UserAccount} objects.
 *
 * @author Karol Talbot
 * @version 1.1
 */
@Component
public final class UserAccountResourceAssembler implements ResourceAssembler<UserAuthLinkWrapper<UserAccount>, Resource<UserAccount>> {

	@Override
	public Resource<UserAccount> toResource(final UserAuthLinkWrapper<UserAccount> userAuthLinkWrapper) {
		final UserAccount userAccount = userAuthLinkWrapper.getModelObject();
		final Resource<UserAccount> resource = new Resource<>(userAccount,
			linkTo(methodOn(UserAccountController.class).getAccount(userAccount.getId(), userAuthLinkWrapper.getManager())).withSelfRel(),
			linkTo(methodOn(UserAccountController.class).getActiveAccounts(userAuthLinkWrapper.getManager())).withRel("accounts"),
			linkTo(methodOn(ProjectController.class).getProjectsByUserAccount(userAccount.getId(), null)).withRel("projects"),
			linkTo(methodOn(ReportController.class).getProductivityReport(userAccount.getId())).withRel("productivityreport"),
			linkTo(methodOn(ReportController.class).getProductivityReportExcel(userAccount.getId())).withRel("productivityreportexcel")
		);

		final Link deleteLink = linkTo(methodOn(UserAccountController.class).setUserAccountInactive(userAccount.getId())).withRel("delete");
		if (userAuthLinkWrapper.getManager().linkAuthorization(deleteLink.getHref(), "DELETE")) {
			resource.add(deleteLink);
		}

		final Link updateLink = linkTo(methodOn(UserAccountController.class).updateUserAccount(userAccount.getId(), userAccount, userAuthLinkWrapper.getManager())).withRel("update");
		if (userAuthLinkWrapper.getManager().linkAuthorization(updateLink.getHref(), "PUT")) {
			resource.add(updateLink);
		}
		return resource;
	}
}
