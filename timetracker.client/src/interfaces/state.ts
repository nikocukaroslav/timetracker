import { UserModel, WorkSessionModel } from "./domain.ts";

export interface EmployeesState {
    loading: boolean;
    user: UserModel;
    users: UserModel[];
}

export interface AuthenticationState {
    user: UserModel | null;
    accessToken: string | null;
    expiresAt: number | null;
    loading: boolean;
    error: string | null;
}

export interface TimeTrackerState {
    workSessions: WorkSessionModel[];
    sessionId: string | null;
    isTracking: boolean;
    currentTime: number;
}

export interface State {
    employees: EmployeesState
    authentication: AuthenticationState
    timeTracker: TimeTrackerState
}