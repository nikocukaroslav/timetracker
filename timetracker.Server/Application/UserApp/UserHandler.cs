using GraphQL;
using timetracker.Server.Application.Interfaces;
using timetracker.Server.Application.UserApp.Commands;
using timetracker.Server.Domain.Exceptions;
using timetracker.Server.Domain.Entities;
using timetracker.Server.Infrastructure.Interfaces;

namespace timetracker.Server.Application.UserApp
{
    public class UserHandler : 
        ICommandHandler<AddUserCommand, User>, 
        ICommandHandler<DeleteUserCommand, string>,
        ICommandHandler<UpdateUserCommand, User>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;

        public UserHandler(IUserRepository userRepository, IPasswordHasher passwordHasher)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
        }
        public async Task<User> Handle(AddUserCommand command, ExecutionErrors contextErrors)
        {
            if (command is null)
            {
                contextErrors.Add(new ExecutionError("Invalid credentials")
                {
                    Code = ExceptionsCode.INVALID_CREDENTIALS.ToString(),
                });
                return null;
            }

            if (command.Password.Length < 8 || command.Password.Length > 20)
            {
                contextErrors.Add(new ExecutionError("Password must be between 8 and 20 characters")
                {
                    Code = ExceptionsCode.INVALID_PASSWORD_LENGTH.ToString(),
                });
                return null;
            }

            var emailRegex = new System.Text.RegularExpressions.Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            if (!emailRegex.IsMatch(command.Email))
            {
                contextErrors.Add(new ExecutionError("Invalid email format")
                {
                    Code = ExceptionsCode.INVALID_EMAIL_FORMAT.ToString(),
                });
                return null;
            }

            if (await _userRepository.GetUserByEmailAsync(command.Email) != null)
            {
                contextErrors.Add(new ExecutionError("This email is already registered")
                {
                    Code = ExceptionsCode.EMAIL_EXIST.ToString(),
                });
                return null;
            }

            var hashPasswordResponce = _passwordHasher.HashPassword(command.Password);

            var user = new User()
            {
                Name = command.Name,
                Surname = command.Surname,
                Email = command.Email,
                Password = hashPasswordResponce.Password,
                Salt = hashPasswordResponce.Salt,
                EmploymentType = command.EmploymentType,
                Permissions = string.Join(",", command.Permissions)
            };

            return await _userRepository.AddAsync(user);
        }

        public async Task<string> Handle(DeleteUserCommand command, ExecutionErrors contextErrors)
        {
            var user = await _userRepository.GetByIdAsync(command.UserId);
            if (user is null)
            {
                contextErrors.Add(new ExecutionError("User is not found")
                {
                    Code = ExceptionsCode.USER_NOT_FOUND.ToString(),
                });
                return null;
            }

            await _userRepository.DeleteAsync(command.UserId);

            return "User deleted successful";
        }

        public async Task<User> Handle(UpdateUserCommand command, ExecutionErrors contextErrors)
        {
            var user = await _userRepository.GetByIdAsync(command.Id);
            if (user is null)
            {
                contextErrors.Add(new ExecutionError("User is not found")
                {
                    Code = ExceptionsCode.USER_NOT_FOUND.ToString(),
                });
                return null;
            }

            user.Name = command.Name ?? user.Name;
            user.Surname = command.Surname ?? user.Surname;
            user.EmploymentType = command.EmploymentType ?? user.EmploymentType;
            if (command.Permissions != null)
            {
                user.Permissions = string.Join(",", command.Permissions);
            }

            return await _userRepository.UpdateAsync(user);
        }
    }
}
