﻿using GraphQL.Types;
using timetracker.Server.API.Auth;
using timetracker.Server.API.Role;
using timetracker.Server.API.User;
using timetracker.Server.API.WorkDay;
using timetracker.Server.API.WorkSession;

namespace timetracker.Server.API
{
    public class RootMutation : ObjectGraphType
    {
        public RootMutation()
        {
            Field<AuthMutation>("auth").Resolve(_ => new { });
            Field<UserMutation>("users").Resolve(_ => new { });
            Field<RoleMutation>("roles").Resolve(_ => new { });
            Field<WorkSessionMutation>("workSessions").Resolve(_=> new { });
            Field<WorkDayMutation>("workDays").Resolve(_=> new { });
        }
    }
}