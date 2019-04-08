package ca.projectTOMi.tomi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class StaticController {

	@RequestMapping (value = {"/sign_in", "/my_timesheets", "/manage_projects", "/manage_teams", "/manage_unit_types", "/manage_tasks", "/manage_user_accounts", "/approve_timesheets"}, method = GET)
	public RedirectView redirectWithUsingRedirectView(RedirectAttributes attributes) {
		return new RedirectView("/");
	}
}
