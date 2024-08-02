using GraphQL;

namespace timetracker.Server.Application.Interfaces
{
    public interface ICommandHandler<TCommand, TResolver>
    {
        Task<TResolver> Handle(TCommand command, ExecutionErrors contextErrors);
    }
}
