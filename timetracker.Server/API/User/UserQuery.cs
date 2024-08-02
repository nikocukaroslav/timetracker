using GraphQL;
using GraphQL.Types;
using timetracker.Server.API.User.Types;
using timetracker.Server.Domain.Exceptions;
using timetracker.Server.Infrastructure.Interfaces;

namespace timetracker.Server.API.User
{
    public class UserQuery : ObjectGraphType
    {
        public UserQuery(IUserRepository userRepository)
        {
            this.Authorize();

            Field<ListGraphType<UsersResponseType>>("GetUsers")
               .ResolveAsync(async context =>
               {
                   return await userRepository.GetAllAsync();
               });

            Field<UserType>("GetUser")
               .Arguments(new QueryArguments(new QueryArgument<GuidGraphType> { Name = "id" }))
               .ResolveAsync(async context =>
               {
                   var user = await userRepository.GetByIdAsync(context.GetArgument<Guid>("id"));

                   if (user == null)
                   {
                       context.Errors.Add(new ExecutionError("User is not found")
                       {
                           Code = ExceptionsCode.USER_NOT_FOUND.ToString(),
                       });
                       return null;
                   }

                   return user;
               });
        }
    }
}
