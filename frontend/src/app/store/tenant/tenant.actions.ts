import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CreateIssueDTO, Issue } from "./tenant.model";
import { NestError } from "../user/user.model";

export const TenantActions = createActionGroup({
    source: 'Tenant',
    events: {
        '[Tenant] Load tenant issues': emptyProps(),
        '[Tenant] Load tenant issues Success': props<{ issues: Issue[] }>(),
        '[Tenant] Load tenant issues Failure': props<{ error: NestError }>(),

        '[Tenant] Create tenant issue': props<{ issue: CreateIssueDTO }>(),
        '[Tenant] Create tenant issue Success': props<{ issue: Issue }>(),
        '[Tenant] Create tenant issue Failure': props<{ error: NestError }>(),

        '[Building Issues] Load building issues': emptyProps(),
        '[Building Issues] Load building issues Success': props<{ issues: Issue[] }>(),
        '[Building Issues] Load building issues Failure': props<{ error: NestError }>(),

        '[WebSocket] Initialize': emptyProps(),
        '[WebSocket] Disconnect': emptyProps(),
        '[WebSocket] Connected': emptyProps(),
        '[WebSocket] Disconnected': emptyProps(),
        '[WebSocket] Error': props<{ error: any }>(),
        '[WebSocket] Server Error': props<{ error: string }>(),
        '[WebSocket] Unknown Message': props<{ message: any }>(),

        '[WebSocket] Send Subscribe': props<{ userID: string }>(),
        '[WebSocket] Subscribed Successfully': props<{ data: { buildingID: string } }>(),

        '[Building Issues] New Issue Added': props<{ issue: Issue }>(),
        '[Building Issues] Issue Updated': props<{ issue: Issue }>(),

        '[My Issues] Issue Updated': props<{ issue: Issue }>(),
    }
})