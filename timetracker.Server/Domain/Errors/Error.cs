﻿using GraphQL.Validation;
using System.Runtime.CompilerServices;

namespace timetracker.Server.Domain.Errors
{
    public class Error : ValidationError
    {
        public Error(string message, [CallerMemberName] string code = "UNKNOWN_ERROR") : base(message)
        {
            Code = code;
        }
    }
}
