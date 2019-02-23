package ca.projectTOMi.tomi.authorization.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import ca.projectTOMi.tomi.authorization.manager.AuthManager;
import ca.projectTOMi.tomi.authorization.manager.ProjectAuthManager;
import ca.projectTOMi.tomi.authorization.policy.ProjectAuthorizationPolicy;
import ca.projectTOMi.tomi.authorization.manager.TimesheetAuthManager;
import ca.projectTOMi.tomi.authorization.policy.TimesheetAuthorizationPolicy;
import ca.projectTOMi.tomi.authorization.manager.UserAuthManager;
import ca.projectTOMi.tomi.authorization.policy.UserAuthorizationPolicy;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.persistence.ProjectAuthorizationRepository;
import ca.projectTOMi.tomi.persistence.TimesheetAuthorizationRepository;
import ca.projectTOMi.tomi.persistence.UserAuthorizationRepository;
import ca.projectTOMi.tomi.service.EntryService;
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
	private final UserAccountService userAccountService;
	private final EntryService entryService;

	@Autowired
	public AuthorizationInterceptor(final UserAuthorizationRepository userAuthRepository,
	                                final ProjectAuthorizationRepository projectAuthRepository,
	                                final TimesheetAuthorizationRepository timesheetAuthRepository,
	                                final UserAccountService userAccountService,
	                                final EntryService entryService) {
		this.projectAuthRepository = projectAuthRepository;
		this.timesheetAuthRepository = timesheetAuthRepository;
		this.userAuthRepository = userAuthRepository;
		this.userAccountService = userAccountService;
		this.entryService = entryService;
	}

	@Override
	public boolean preHandle(
		final HttpServletRequest request, final HttpServletResponse response, final Object handler) throws Exception {
		final String authToken = request.getHeader("Authorization");

		//TODO Remove Hardcoded UserAccount---------------
		final UserAccount user = this.userAccountService.getUserAccount(1L);
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
			final AuthManager<TimesheetAuthorizationPolicy> authMan;
			authMan = new TimesheetAuthManager(user, getOwner(requestURI, requestMethod, user));
			authMan.loadUserPolicies(this.timesheetAuthRepository.getAllByRequestingUser(user));
			request.setAttribute("authMan", authMan);
		} else if ("ProjectController".matches(controller)) {
			if ("POST".equals(requestMethod) || "DELETE".equals(requestMethod)) {
				final AuthManager<UserAuthorizationPolicy> authMan;
				authMan = new UserAuthManager(user);
				authMan.loadUserPolicies(this.userAuthRepository.getAllByRequestingUser(user));
				request.setAttribute("authMan", authMan);
			} else {
				final AuthManager<ProjectAuthorizationPolicy> authMan;
				authMan = new ProjectAuthManager(user);
				authMan.loadUserPolicies(this.projectAuthRepository.getAllByRequestingUser(user));
				request.setAttribute("authMan", authMan);
			}
		} else if ("ExpenseController".matches(controller)) {
			final AuthManager<ProjectAuthorizationPolicy> authMan;
			authMan = new ProjectAuthManager(user);
			authMan.loadUserPolicies(this.projectAuthRepository.getAllByRequestingUser(user));
			request.setAttribute("authMan", authMan);
		} else {
			final AuthManager<UserAuthorizationPolicy> authMan;
			authMan = new UserAuthManager(user);
			authMan.loadUserPolicies(this.userAuthRepository.getAllByRequestingUser(user));
			request.setAttribute("authMan", authMan);
		}
		return ((AuthManager) request.getAttribute("authMan")).requestAuthorization(requestURI, requestMethod);
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

	private UserAccount getOwner(final String URI, final String requestMethod, final UserAccount requestingUser) {
		UserAccount owner = null;
		if("POST".equals(requestMethod)){
			owner = requestingUser;
		} else if (URI.matches("^/timesheets/[0-9]+/{0,1}$|^/timesheets/[0-9]+/entries$")) {
			owner = this.entryService.getTimesheetById(Long.parseLong(URI.split("/")[2])).getUserAccount();
		} else if (URI.matches("^/timesheets/user_accounts/[0-9]+/{0,1}$")) {
			owner = this.userAccountService.getUserAccount(Long.parseLong(URI.split("/")[3]));
		}else if(URI.matches("^/entries/[0-9]+/{0,1}$|^/entries/[0-9]+/copy")){
			owner = this.entryService.getEntry(Long.parseLong(URI.split("/")[2])).getTimesheet().getUserAccount();
		}else if(URI.matches("^/timesheets/[0-9]+/submit/{0,1}$")){
			owner = this.entryService.getTimesheetById(Long.parseLong(URI.split("/")[2])).getUserAccount();
		}
		return owner;
	}
}
