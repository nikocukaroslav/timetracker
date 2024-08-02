using GraphQL;
using GraphQL.Types;
using timetracker.Server.API.User.Types;
using timetracker.Server.Domain.Enums;
using timetracker.Server.Application.UserApp.Commands;
using timetracker.Server.Application.UserApp;

namespace timetracker.Server.API.User
{
    public class UserMutation : ObjectGraphType
    {
        public UserMutation(UserHandler handler)
        {
            this.Authorize();

            Field<UserType>("AddUser")
                .AuthorizeWithPolicy(Permissions.MANAGE_USERS.ToString())
                .Arguments(new QueryArguments(new QueryArgument<UserInputType> { Name = "user" }))
                .ResolveAsync(async context =>
                {
                    var command = context.GetArgument<AddUserCommand>("user");
                    return await handler.Handle(command, context.Errors);
                });

            Field<StringGraphType>("DeleteUser")
                .AuthorizeWithPolicy(Permissions.MANAGE_USERS.ToString())
                .Arguments(new QueryArguments(new QueryArgument<GuidGraphType> { Name = "id" }))
                .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<Guid>("id");
                    var command = new DeleteUserCommand { UserId = userId };
                    return await handler.Handle(command, context.Errors);
                });

            Field<UserType>("UpdateUser")
                 .Arguments(new QueryArguments(
                    new QueryArgument<UserUpdateType> { Name = "user" }))
                 .ResolveAsync(async context =>
                 {
                     var command = context.GetArgument<UpdateUserCommand>("user");
                     return await handler.Handle(command, context.Errors);
                 });
        }
    }
}
