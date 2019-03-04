package ca.projectTOMi.tomi.authorization.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import ca.projectTOMi.tomi.model.UserAccount;
import ca.projectTOMi.tomi.service.EntryService;
import ca.projectTOMi.tomi.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
/**
 * @author Karol Talbot
 */
@Component
@CrossOrigin (origins = "http://localhost:4200")
public class AuthorizationInterceptor implements HandlerInterceptor {
	private final UserAccountService userAccountService;
	private final EntryService entryService;
	private int i = 0;

	@Autowired
	public AuthorizationInterceptor(
	                                final UserAccountService userAccountService,
	                                final EntryService entryService) {
		this.userAccountService = userAccountService;
		this.entryService = entryService;
	}

	@Override
	public boolean preHandle(final HttpServletRequest request, final HttpServletResponse response, final Object handler) throws Exception {
		Long start = System.currentTimeMillis();
		request.setAttribute("start", start);
		
		return true;
	}

	@Override
	public void postHandle(
		final HttpServletRequest request, final HttpServletResponse response, final Object handler,
		final ModelAndView modelAndView) throws Exception {
		Long start = (Long) request.getAttribute("start");
		String requestURI = request.getRequestURI();
		Long stop = System.currentTimeMillis();
		System.out.printf("Call %d%s: %s executed in %dms%n", i++, requestURI, request.getMethod(),stop-start );
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
