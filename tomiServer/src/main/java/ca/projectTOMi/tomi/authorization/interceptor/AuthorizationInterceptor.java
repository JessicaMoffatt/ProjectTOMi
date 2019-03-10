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
import ca.projectTOMi.tomi.persistence.TimesheetAuthRepository;
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
 * @author Karol Talbot
 */
@Component
@CrossOrigin (origins = "http://localhost:4200")
public class AuthorizationInterceptor implements HandlerInterceptor {
	private final ProjectAuthorizationRepository projectAuthRepository;
	private final TimesheetAuthRepository timesheetAuthRepository;
	private final UserAuthorizationRepository userAuthRepository;
	private final UserAccountService userAccountService;
	private final EntryService entryService;
	private final UserAuthenticationService userAuthenticationService;
	private int i = 0;

	@Autowired
	public AuthorizationInterceptor(final UserAuthorizationRepository userAuthRepository,
	                                final ProjectAuthorizationRepository projectAuthRepository,
	                                final TimesheetAuthRepository timesheetAuthRepository,
	                                final UserAccountService userAccountService,
	                                final EntryService entryService,
	                                final UserAuthenticationService userAuthenticationService) {
		this.projectAuthRepository = projectAuthRepository;
		this.timesheetAuthRepository = timesheetAuthRepository;
		this.userAuthRepository = userAuthRepository;
		this.userAccountService = userAccountService;
		this.entryService = entryService;
		this.userAuthenticationService = userAuthenticationService;
	}

	@Override
	public boolean preHandle(final HttpServletRequest request, final HttpServletResponse response, final Object handler) {
		final Long start = System.currentTimeMillis();
		request.setAttribute("start", start);
		final String authToken = request.getHeader("SignIn");

		// Initial Login
		if ("/tokensignin".equals(request.getRequestURI())) {
			return true;
		} else if (request.getMethod().matches("OPTIONS")) {
			return true;
		}


		final UserAccount user;
		//TODO Remove Hardcoded UserAccount---------------
		try {
			user = this.userAuthenticationService.checkLogin(authToken);
		}catch (final Exception e){
			System.out.println(request.getMethod() + " " +e);
			return false;
		}
		if(user == null){
			return false;
		}
		//TODO -------------------------------------------

		final String requestMethod = request.getMethod();
		final String requestURI = request.getRequestURI();
		String controller;
		try {
			controller = ((HandlerMethod) handler).getMethod().getDeclaringClass().toString();
			controller = controller.replace("class ca.projectTOMi.tomi.controller.", "");
		} catch (final ClassCastException e) {
			return true;
		}
		if(requestURI.contains("build_nav_bar")){
			final AuthManager<UserAuthorizationPolicy> authMan;
			authMan = new UserAuthManager(user);
			authMan.loadUserPolicies(this.userAuthRepository.getAllByRequestingUser(user));
			request.setAttribute("authMan", authMan);
			return true;
		}else if ("TimesheetController".matches(controller) || "EntryController".matches(controller)) {
			final AuthManager<TimesheetAuthorizationPolicy> authMan;
			authMan = new TimesheetAuthManager(user, this.getOwner(requestURI, requestMethod, user));
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
		} else if ("ReportController".matches(controller)) {
			if (requestURI.contains("budget")) {
				final AuthManager<ProjectAuthorizationPolicy> authMan;
				authMan = new ProjectAuthManager(user);
				authMan.loadUserPolicies(this.projectAuthRepository.getAllByRequestingUser(user));
				request.setAttribute("authMan", authMan);
			} else if (requestURI.contains("data_dump_report")|| requestURI.contains("billable_hours_report")) {
				final AuthManager<UserAuthorizationPolicy> authMan;
				authMan = new UserAuthManager(user);
				authMan.loadUserPolicies(this.userAuthRepository.getAllByRequestingUser(user));
				request.setAttribute("authMan", authMan);
			} else if(requestURI.contains("productivity_report")){
				final AuthManager<TimesheetAuthorizationPolicy> authMan;
				final UserAccount owner = this.userAccountService.getUserAccount(Long.parseLong(requestURI.split("/")[2]));
				authMan = new TimesheetAuthManager(user,owner);
				authMan.loadUserPolicies(this.timesheetAuthRepository.getAllByRequestingUser(user));
				request.setAttribute("authMan", authMan);
			}else {
				return false;
			}
		} else {
			final AuthManager<UserAuthorizationPolicy> authMan;
			authMan = new UserAuthManager(user);
			authMan.loadUserPolicies(this.userAuthRepository.getAllByRequestingUser(user));
			request.setAttribute("authMan", authMan);
		}
//		return true;
		return ((AuthManager) request.getAttribute("authMan")).requestAuthorization(requestURI, requestMethod);
	}

	@Override
	public void postHandle(
		final HttpServletRequest request, final HttpServletResponse response, final Object handler,
		final ModelAndView modelAndView) {
		final Long start = (Long) request.getAttribute("start");
		final String requestURI = request.getRequestURI();
		final Long stop = System.currentTimeMillis();
		System.out.printf("Call %d %s: %s executed in %dms%n", this.i++, requestURI, request.getMethod(), stop - start);
	}

	@Override
	public void afterCompletion(final HttpServletRequest request, final HttpServletResponse response,
	                            final Object handler, final Exception exception) {
	}

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
