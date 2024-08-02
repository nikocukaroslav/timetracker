using GraphQL;
using GraphQL.Types;
using timetracker.Server.Domain.Enums;

namespace timetracker.Server.API.User.Types
{
    public class UserUpdateType : InputObjectGraphType
    {
        public UserUpdateType()
        {
            Field<GuidGraphType>("id");
            Field<StringGraphType>("name");
            Field<StringGraphType>("surname");
            Field<StringGraphType>("employmentType")
                .AuthorizeWithPolicy(Permissions.MANAGE_USERS.ToString());
            Field<ListGraphType<StringGraphType>>("permissions")
                .AuthorizeWithPolicy(Permissions.MANAGE_USERS.ToString());
        }
    }
}
