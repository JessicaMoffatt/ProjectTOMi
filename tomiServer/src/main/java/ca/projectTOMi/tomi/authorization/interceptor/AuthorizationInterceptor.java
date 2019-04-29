package ca.projectTOMi.tomi.authorization.interceptor;

import java.util.ArrayList;
import java.util.List;
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
import ca.projectTOMi.tomi.service.UserAuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**
 * Intercepts HTTP requests and ensures the requesting user has authorization to perform the
 * requested operation.
 *
 * @author Karol Talbot
 * @version 1
 */
@Component
@CrossOrigin (origins = "http://localhost:4200")
public class AuthorizationInterceptor implements HandlerInterceptor {
	/**
	 * Provides database access for {@link ProjectAuthorizationPolicy} objects.
	 */
	private final ProjectAuthorizationRepository projectAuthRepository;

	/**
	 * Provides database access for {@link TimesheetAuthorizationPolicy} objects.
	 */
	private final TimesheetAuthorizationRepository timesheetAuthorizationRepository;

	/**
	 * Provides database access for {@link UserAuthorizationPolicy} objects.
	 */
	private final UserAuthorizationRepository userAuthRepository;

	/**
	 * Provides services to maintain business logic for UserAccount requests.
	 */
	private final UserAccountService userAccountService;

	/**
	 * Provides services to maintain business logic for entry and timesheet requests.
	 */
	private final EntryService entryService;

	/**
	 * Provides services required for user authentication.
	 */
	private final UserAuthenticationService userAuthenticationService;

	/**
	 * Constructs a new AuthorizationInterceptor with the provided parameters.
	 *
	 * @param userAuthRepository
	 * 	Provides database access for {@link ProjectAuthorizationPolicy} objects
	 * @param projectAuthRepository
	 * 	Provides database access for {@link TimesheetAuthorizationPolicy} objects
	 * @param timesheetAuthorizationRepository
	 * 	Provides database access for {@link UserAuthorizationPolicy} objects
	 * @param userAccountService
	 * 	Provides services to maintain business logic for UserAccount requests
	 * @param entryService
	 * 	Provides services to maintain business logic for entry and timesheet requests
	 * @param userAuthenticationService
	 * 	Provides services required for user authentication
	 */
	@Autowired
	public AuthorizationInterceptor(final UserAuthorizationRepository userAuthRepository,
	                                final ProjectAuthorizationRepository projectAuthRepository,
	                                final TimesheetAuthorizationRepository timesheetAuthorizationRepository,
	                                final UserAccountService userAccountService,
	                                final EntryService entryService,
	                                final UserAuthenticationService userAuthenticationService) {
		this.projectAuthRepository = projectAuthRepository;
		this.timesheetAuthorizationRepository = timesheetAuthorizationRepository;
		this.userAuthRepository = userAuthRepository;
		this.userAccountService = userAccountService;
		this.entryService = entryService;
		this.userAuthenticationService = userAuthenticationService;
	}

	/**
	 * Intercepts HTTP requests and performs check prior to allowing the request to be permitted.
	 *
	 * @param request
	 * 	The request made by the requesting entity
	 * @param response
	 * 	The response to the requesting entity
	 * @param handler
	 * 	The spring component that will handle the request
	 *
	 * @return if the operation is permitted
	 */
	@Override
	public boolean preHandle(final HttpServletRequest request, final HttpServletResponse response, final Object handler) {
		final String authToken = request.getHeader("SignIn");
		final String requestMethod = request.getMethod();
		final String requestURI = request.getRequestURI();
		String controller;
		final UserAccount user;
		System.out.println(requestURI);
		if(requestURI.matches("^.+ico$|^.+css$|^.+js$|^.+html$|^.+svg$|^.+.png$|^/sign_in$|^/my_timesheets$|^/manage_projects$|^/manage_teams$|^/manage_unit_types$|^/manage_tasks$|^/manage_user_accounts$|^/approve_timesheets$")){
			return true;
		}
		// Initial Login
		if ("/tokensignin".equals(request.getRequestURI())) {
			return true;
		} else if (request.getMethod().matches("OPTIONS")) {
			return true;
		}

		try {
			user = this.userAuthenticationService.checkLogin(authToken);
		} catch (final Exception e) {
			System.out.println(request.getMethod() + " " + e);
			return false;
		}
		if (user == null) {
			return false;
		}


		try {
			controller = ((HandlerMethod) handler).getMethod().getDeclaringClass().toString();
			controller = controller.replace("class ca.projectTOMi.tomi.controller.", "");
		} catch (final ClassCastException e) {
			return true;
		}
		if (requestURI.contains("build_nav_bar")) {
			final AuthManager<UserAuthorizationPolicy> authMan;
			authMan = new UserAuthManager(user);
			authMan.loadUserPolicies(this.userAuthRepository.getAllByRequestingUser(user));
			request.setAttribute("authMan", authMan);
			return true;
		} else if ("TimesheetController".matches(controller) || "EntryController".matches(controller)) {
			final AuthManager<TimesheetAuthorizationPolicy> authMan;
			authMan = new TimesheetAuthManager(user, this.getOwner(requestURI, requestMethod, user));
			authMan.loadUserPolicies(this.timesheetAuthorizationRepository.getAllByRequestingUser(user));
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
				List<ProjectAuthorizationPolicy> f;
				try {
					f = this.projectAuthRepository.findAllByRequestingUser(user).orElse(new ArrayList<>());
				} catch (Exception e) {
					System.out.println("this");
					f = new ArrayList<>();
				}
				authMan.loadUserPolicies(f);
				request.setAttribute("authMan", authMan);
			}
		} else if ("ExpenseController".matches(controller)) {
			final AuthManager<ProjectAuthorizationPolicy> authMan;
			authMan = new ProjectAuthManager(user);
			authMan.loadUserPolicies(this.projectAuthRepository.findAllByRequestingUser(user).orElse(new ArrayList<>()));
			request.setAttribute("authMan", authMan);
		} else if ("ReportController".matches(controller)) {
			if (requestURI.contains("budget")) {
				final AuthManager<ProjectAuthorizationPolicy> authMan;
				authMan = new ProjectAuthManager(user);
				authMan.loadUserPolicies(this.projectAuthRepository.findAllByRequestingUser(user).orElse(new ArrayList<>()));
				request.setAttribute("authMan", authMan);
			} else if (requestURI.contains("data_dump_report") || requestURI.contains("billable_hours_report")) {
				final AuthManager<UserAuthorizationPolicy> authMan;
				authMan = new UserAuthManager(user);
				authMan.loadUserPolicies(this.userAuthRepository.getAllByRequestingUser(user));
				request.setAttribute("authMan", authMan);
			} else if (requestURI.contains("productivity_report")) {
				final AuthManager<TimesheetAuthorizationPolicy> authMan;
				final UserAccount owner = this.userAccountService.getUserAccount(Long.parseLong(requestURI.split("/")[2]));
				authMan = new TimesheetAuthManager(user, owner);
				authMan.loadUserPolicies(this.timesheetAuthorizationRepository.getAllByRequestingUser(user));
				request.setAttribute("authMan", authMan);
			} else {
				return false;
			}
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
		final ModelAndView modelAndView) {
	}

	@Override
	public void afterCompletion(final HttpServletRequest request, final HttpServletResponse response,
	                            final Object handler, final Exception exception) {
	}

	/**
	 * Gets the UserAccount that owns the object that is being requested.
	 *
	 * @param URI
	 * 	URI of the request being made to the server
	 * @param requestMethod
	 * 	Type of HTTP request being made
	 * @param requestingUser
	 * 	UserAccount of user making the HTTP request
	 *
	 * @return The owner of the object being requested
	 */
	private UserAccount getOwner(final String URI, final String requestMethod, final UserAccount requestingUser) {
		UserAccount owner = null;
		if ("POST".equals(requestMethod)) {
			owner = requestingUser;
		} else if (URI.matches("^/timesheets/[0-9]+/?$|^/timesheets/[0-9]+/entries$")) {
			owner = this.entryService.getTimesheetById(Long.parseLong(URI.split("/")[2])).getUserAccount();
		} else if (URI.matches("^/timesheets/user_accounts/[0-9]+/?$")) {
			owner = this.userAccountService.getUserAccount(Long.parseLong(URI.split("/")[3]));
		} else if (URI.matches("^/entries/[0-9]+/?$|^/entries/[0-9]+/copy")) {
			owner = this.entryService.getEntry(Long.parseLong(URI.split("/")[2])).getTimesheet().getUserAccount();
		} else if (URI.matches("^/timesheets/[0-9]+/submit/?$")) {
			owner = this.entryService.getTimesheetById(Long.parseLong(URI.split("/")[2])).getUserAccount();
		}
		return owner;
	}
}
