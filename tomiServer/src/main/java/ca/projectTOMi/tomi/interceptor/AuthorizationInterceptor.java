package ca.projectTOMi.tomi.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import ca.projectTOMi.tomi.authorization.manager.AuthorizationManager;
import ca.projectTOMi.tomi.authorization.manager.ProjectAuthorizationManager;
import ca.projectTOMi.tomi.authorization.policy.ProjectAuthorizationPolicy;
import ca.projectTOMi.tomi.authorization.manager.TimesheetAuthorizationManager;
import ca.projectTOMi.tomi.authorization.policy.TimesheetAuthorizationPolicy;
import ca.projectTOMi.tomi.authorization.manager.UserAuthorizationManager;
import ca.projectTOMi.tomi.authorization.policy.UserAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.ProjectAuthorizationRepository;
import ca.projectTOMi.tomi.persistence.TimesheetAuthorizationRepository;
import ca.projectTOMi.tomi.persistence.UserAuthorizationRepository;
import ca.projectTOMi.tomi.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Component
@CrossOrigin (origins = "http://localhost:4200")
public class AuthorizationInterceptor implements HandlerInterceptor {
	private final ProjectAuthorizationRepository projectAuthRepository;
	private final TimesheetAuthorizationRepository timesheetAuthRepository;
	private final UserAuthorizationRepository userAuthRepository;
	private final UserAccountService service;

	@Autowired
	public AuthorizationInterceptor(final UserAuthorizationRepository userAuthRepository, final ProjectAuthorizationRepository projectAuthRepository, final TimesheetAuthorizationRepository timesheetAuthRepository, final UserAccountService service) {
		this.projectAuthRepository = projectAuthRepository;
		this.timesheetAuthRepository = timesheetAuthRepository;
		this.userAuthRepository = userAuthRepository;
		this.service = service;
	}

	@Override
	public boolean preHandle(
		final HttpServletRequest request, final HttpServletResponse response, final Object handler) throws Exception {
		final String authToken = request.getHeader("Authorization");

		//TODO Remove Hardcoded UserAccount---------------
		final UserAccount user = this.service.getUserAccount(1L);
		//TODO -------------------------------------------

		final String requestMethod = request.getMethod();
		final String requestURI = request.getRequestURI();
		String controller = "";
		try {
			controller = ((HandlerMethod) handler).getMethod().getDeclaringClass().toString();
			controller = controller.replace("class ca.projectTOMi.tomi.controller.", "");
		} catch (final ClassCastException e) {
			return true;
		}
		if ("TimesheetController".matches(controller) || "EntryController".matches(controller)) {
			final AuthorizationManager<TimesheetAuthorizationPolicy> authMan;
			authMan = new TimesheetAuthorizationManager(user);
			authMan.loadUserPolicies(this.timesheetAuthRepository.getAllByRequestingUser(user));
			request.setAttribute("authMan", authMan);
		} else if ("ProjectController".matches(controller)) {
			if ("POST".equals(requestMethod) || "DELETE".equals(requestMethod)) {
				final AuthorizationManager<UserAuthorizationPolicy> authMan;
				authMan = new UserAuthorizationManager(user);
				authMan.loadUserPolicies(this.userAuthRepository.getAllByRequestingUser(user));
				request.setAttribute("authMan", authMan);
			} else {
				final AuthorizationManager<ProjectAuthorizationPolicy> authMan;
				authMan = new ProjectAuthorizationManager(user);
				authMan.loadUserPolicies(this.projectAuthRepository.getAllByRequestingUser(user));
				request.setAttribute("authMan", authMan);
			}
		} else if ("ExpenseController".matches(controller)) {
			final AuthorizationManager<ProjectAuthorizationPolicy> authMan;
			authMan = new ProjectAuthorizationManager(user);
			authMan.loadUserPolicies(this.projectAuthRepository.getAllByRequestingUser(user));
			request.setAttribute("authMan", authMan);
		} else {
			final AuthorizationManager<UserAuthorizationPolicy> authMan;
			authMan = new UserAuthorizationManager(user);
			authMan.loadUserPolicies(this.userAuthRepository.getAllByRequestingUser(user));
			request.setAttribute("authMan", authMan);
		}
		return ((AuthorizationManager) request.getAttribute("authMan")).requestAuthorization(requestURI, requestMethod);
	}

	@Override
	public void postHandle(
		final HttpServletRequest request, final HttpServletResponse response, final Object handler,
		final ModelAndView modelAndView) throws Exception {
	}

	@Override
	public void afterCompletion(final HttpServletRequest request, final HttpServletResponse response,
	                            final Object handler, final Exception exception) throws Exception {
	}
}
