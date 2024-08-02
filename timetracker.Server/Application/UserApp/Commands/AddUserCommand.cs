namespace timetracker.Server.Application.UserApp.Commands
{
    public class AddUserCommand
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string EmploymentType { get; set; }
        public List<string> Permissions { get; set; }
    }
}
