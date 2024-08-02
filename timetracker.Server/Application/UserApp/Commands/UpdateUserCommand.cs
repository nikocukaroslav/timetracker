namespace timetracker.Server.Application.UserApp.Commands
{
    public class UpdateUserCommand
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string EmploymentType { get; set; }
        public List<string> Permissions { get; set; }
    }
}
