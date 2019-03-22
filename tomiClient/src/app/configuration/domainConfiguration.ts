export const domain: string ='http://localhost:8080/';

/** The link used to get,post, and delete entries. */
export const timesheetUrl = domain + 'timesheets';
/** The link used to get all timesheets for a specified user.*/
export const userTimesheetUrl = timesheetUrl + '/user_accounts';
/** The link used to GET, POST and DELETE users. */
export const userAccountUrl = domain + 'user_accounts';
/** The link used to GET, POST and DELETE unit types. */
export const unitTypeUrl = domain + 'unit_types';
/** The link used to get,post, and delete teams. */
export const teamUrl = domain + 'teams';
/** The link used to get,post, and delete tasks. */
export const taskUrl = domain + 'tasks';

export const buildNavBarUrl = domain + 'build_nav_bar';

/** The URL for accessing projects.*/
export const projectsUrl = domain + 'projects';

export const dataDumpUrl = domain + 'data_dump_report/xls';

export const billableUrl = domain + 'billable_hours_report';

/** The URL used to get,post, and delete entries. */
export const entryUrl = domain + 'entries';
