﻿using timetracker.Server.Domain.Attributes;

namespace timetracker.Server.Domain.Entities
{
    [TableName("Users")]
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Salt { get; set; }
        public string EmploymentType { get; set; }
        public string Permissions { get; set; }
        public string? RefreshTokenHash { get; set; }
    }
}
