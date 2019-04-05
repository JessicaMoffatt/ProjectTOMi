/** The domain portion of all links used in this application.*/
export const domain: string ='http://localhost:8080/';

/** The link used to get,post, and delete entries. */
export const timesheetUrl = domain + 'timesheets';
/** The link used to get all timesheets for a specified user.*/
export const userTimesheetUrl = timesheetUrl + '/user_accounts';
/** The link used to access users. */
export const userAccountUrl = domain + 'user_accounts';
/** The link used to access unit types. */
export const unitTypeUrl = domain + 'unit_types';
/** The link used to access teams. */
export const teamUrl = domain + 'teams';
/** The link used to access tasks. */
export const taskUrl = domain + 'tasks';
/** The link used for building the navigation bar. */
export const buildNavBarUrl = domain + 'build_nav_bar';
/** The link used to access projects.*/
export const projectsUrl = domain + 'projects';
/** The link used to retrieve the data dump report in xls format.*/
export const dataDumpUrl = domain + 'data_dump_report/xls';
/** The link used to retrieve the billable hour report in xls format.*/
export const billableHourDownloadUrl = domain + 'billable_hours_report/xls';
/** The link used to access the billable hour report.*/
export const billableUrl = domain + 'billable_hours_report';
/** The URL used to get,post, and delete entries. */
export const entryUrl = domain + 'entries';
/** The URL used to get,post, and delete clients. */
export const clientUrl = domain + 'clients';

