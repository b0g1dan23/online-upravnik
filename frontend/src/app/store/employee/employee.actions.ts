import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Issue } from "../tenant/tenant.model";
import { NestError } from "../user/user.model";

export const EmployeeActions = createActionGroup({
    source: 'Employee',
    events: {
        // TODO: Implement UI for this
        '[Issue] Change Issue Status': props<{ issueID: string, newStatus: string }>(),
        '[Issue] Change Issue Status Success': props<{ issue: Issue }>(),
        '[Issue] Change Issue Status Failure': props<{ error: NestError }>(),

        '[Issue] Load All Issues for Building': emptyProps(),
        '[Issue] Load All Issues for Building Success': props<{ issues: Issue[] }>(),
        '[Issue] Load All Issues for Building Failure': props<{ error: NestError }>(),

        '[Issue WebSocket] New Issue Assigned': props<{ issue: Issue }>(),
    }
})