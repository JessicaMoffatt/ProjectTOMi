'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">tomi-client documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AddHeaderInterceptor.html" data-type="entity-link">AddHeaderInterceptor</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AddHeaderInterceptor-ce519f75b3bd37db3d1ff2de1f696b8e"' : 'data-target="#xs-injectables-links-module-AddHeaderInterceptor-ce519f75b3bd37db3d1ff2de1f696b8e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AddHeaderInterceptor-ce519f75b3bd37db3d1ff2de1f696b8e"' :
                                        'id="xs-injectables-links-module-AddHeaderInterceptor-ce519f75b3bd37db3d1ff2de1f696b8e"' }>
                                        <li class="link">
                                            <a href="injectables/SignInService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SignInService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-6c515868558d39ae332346b92dff97e7"' : 'data-target="#xs-components-links-module-AppModule-6c515868558d39ae332346b92dff97e7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-6c515868558d39ae332346b92dff97e7"' :
                                            'id="xs-components-links-module-AppModule-6c515868558d39ae332346b92dff97e7"' }>
                                            <li class="link">
                                                <a href="components/AddProjectComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddProjectComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddProjectExpenseComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddProjectExpenseComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddProjectMemberComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddProjectMemberComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddTaskComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddTaskComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddTeamComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddTeamComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddUnitTypeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddUnitTypeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddUserAccountComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddUserAccountComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ApprovePanelComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ApprovePanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BillableHourReportComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BillableHourReportComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BudgetReportComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BudgetReportComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DataDumpReportComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DataDumpReportComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DatePickerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DatePickerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeleteEntryModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DeleteEntryModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeleteProjectModal.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DeleteProjectModal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeleteTaskModal.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DeleteTaskModal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeleteTeamModal.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DeleteTeamModal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeleteUnitTypeModal.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DeleteUnitTypeModal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeleteUserAccountModal.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DeleteUserAccountModal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditTaskComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditTaskComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditUnitTypeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditUnitTypeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditUserComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditUserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EntryApproveComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EntryApproveComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EntryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EntryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EntryUneditableComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EntryUneditableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExpenseListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExpenseListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManageTeamsPanelComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ManageTeamsPanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProductivityReportComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProductivityReportComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectDetailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectEntriesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectEntriesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectEntriesSidebarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectEntriesSidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectMemberListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectMemberListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectSidebarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectSidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectsPanelComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectsPanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignInComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SignInComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubmitApprovalModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SubmitApprovalModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubmitTimesheetModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SubmitTimesheetModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TasksPanelComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TasksPanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TeamMemberSidebarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TeamMemberSidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TeamMemberTimesheetComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TeamMemberTimesheetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TeamPanelComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TeamPanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TeamProductivityReportComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TeamProductivityReportComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TeamSidebarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TeamSidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimesheetComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TimesheetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TopNavBarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TopNavBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UnitTypePanelComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UnitTypePanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserAccountComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserAccountComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-6c515868558d39ae332346b92dff97e7"' : 'data-target="#xs-injectables-links-module-AppModule-6c515868558d39ae332346b92dff97e7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-6c515868558d39ae332346b92dff97e7"' :
                                        'id="xs-injectables-links-module-AppModule-6c515868558d39ae332346b92dff97e7"' }>
                                        <li class="link">
                                            <a href="injectables/ProjectService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProjectService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SignInService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SignInService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TaskService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TaskService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TeamService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TeamService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TimesheetService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TimesheetService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserAccountService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserAccountService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AppModule-6c515868558d39ae332346b92dff97e7"' : 'data-target="#xs-pipes-links-module-AppModule-6c515868558d39ae332346b92dff97e7"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-6c515868558d39ae332346b92dff97e7"' :
                                            'id="xs-pipes-links-module-AppModule-6c515868558d39ae332346b92dff97e7"' }>
                                            <li class="link">
                                                <a href="pipes/FilterProjectByName.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterProjectByName</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FilterTaskByName.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterTaskByName</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FilterTeamByName.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterTeamByName</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FilterTeamMemberByName.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterTeamMemberByName</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FilterUnitTypeByName.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterUnitTypeByName</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FilterUserAccountByName.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterUserAccountByName</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SignInComponent.html" data-type="entity-link">SignInComponent</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SignInComponent-5d3cfcf7d6c1bf9b8442f62059023cb1"' : 'data-target="#xs-injectables-links-module-SignInComponent-5d3cfcf7d6c1bf9b8442f62059023cb1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SignInComponent-5d3cfcf7d6c1bf9b8442f62059023cb1"' :
                                        'id="xs-injectables-links-module-SignInComponent-5d3cfcf7d6c1bf9b8442f62059023cb1"' }>
                                        <li class="link">
                                            <a href="injectables/SignInService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SignInService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TopNavBarComponent.html" data-type="entity-link">TopNavBarComponent</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TopNavBarComponent-43797db35407265dc84795fd8c3fd626"' : 'data-target="#xs-injectables-links-module-TopNavBarComponent-43797db35407265dc84795fd8c3fd626"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TopNavBarComponent-43797db35407265dc84795fd8c3fd626"' :
                                        'id="xs-injectables-links-module-TopNavBarComponent-43797db35407265dc84795fd8c3fd626"' }>
                                        <li class="link">
                                            <a href="injectables/SignInService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SignInService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/BillableHoursReportLine.html" data-type="entity-link">BillableHoursReportLine</a>
                            </li>
                            <li class="link">
                                <a href="classes/BudgetReport.html" data-type="entity-link">BudgetReport</a>
                            </li>
                            <li class="link">
                                <a href="classes/Client.html" data-type="entity-link">Client</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomDateAdapter.html" data-type="entity-link">CustomDateAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomErrorStateMatcher.html" data-type="entity-link">CustomErrorStateMatcher</a>
                            </li>
                            <li class="link">
                                <a href="classes/Entry.html" data-type="entity-link">Entry</a>
                            </li>
                            <li class="link">
                                <a href="classes/Expense.html" data-type="entity-link">Expense</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterTeamUserAccountByName.html" data-type="entity-link">FilterTeamUserAccountByName</a>
                            </li>
                            <li class="link">
                                <a href="classes/MyErrorStateMatcher.html" data-type="entity-link">MyErrorStateMatcher</a>
                            </li>
                            <li class="link">
                                <a href="classes/MyErrorStateMatcher-1.html" data-type="entity-link">MyErrorStateMatcher</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductivityReportLine.html" data-type="entity-link">ProductivityReportLine</a>
                            </li>
                            <li class="link">
                                <a href="classes/Project.html" data-type="entity-link">Project</a>
                            </li>
                            <li class="link">
                                <a href="classes/Task.html" data-type="entity-link">Task</a>
                            </li>
                            <li class="link">
                                <a href="classes/Team.html" data-type="entity-link">Team</a>
                            </li>
                            <li class="link">
                                <a href="classes/Timesheet.html" data-type="entity-link">Timesheet</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnitType.html" data-type="entity-link">UnitType</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserAccount.html" data-type="entity-link">UserAccount</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ApiService.html" data-type="entity-link">ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClientService.html" data-type="entity-link">ClientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntryService.html" data-type="entity-link">EntryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorService.html" data-type="entity-link">ErrorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExpenseService.html" data-type="entity-link">ExpenseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectService.html" data-type="entity-link">ProjectService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SignInService.html" data-type="entity-link">SignInService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TaskService.html" data-type="entity-link">TaskService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TeamMemberTimesheetService.html" data-type="entity-link">TeamMemberTimesheetService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TeamService.html" data-type="entity-link">TeamService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TimesheetService.html" data-type="entity-link">TimesheetService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UnitTypeService.html" data-type="entity-link">UnitTypeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserAccountService.html" data-type="entity-link">UserAccountService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AccessGuard.html" data-type="entity-link">AccessGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/DeleteDialogData.html" data-type="entity-link">DeleteDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteDialogData-1.html" data-type="entity-link">DeleteDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteDialogData-2.html" data-type="entity-link">DeleteDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteDialogData-3.html" data-type="entity-link">DeleteDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteDialogData-4.html" data-type="entity-link">DeleteDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData.html" data-type="entity-link">DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData-1.html" data-type="entity-link">DialogData</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});