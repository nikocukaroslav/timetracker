﻿using GraphQL.Types;
using WorkDayModel = timetracker.Server.Domain.Entities.WorkDay;
using timetracker.Server.Infrastructure.Interfaces;
using timetracker.Server.API.WorkDay.Types;
using GraphQL;

namespace timetracker.Server.API.WorkDay
{
    public class WorkDayQuery : ObjectGraphType
    {
        public WorkDayQuery(IRepository<WorkDayModel> workDayRepository)
        {
            this.Authorize();


            Field<ListGraphType<WorkDayResponseType>>("GetWorkDays")
               .ResolveAsync(async context =>
               {
                   var workDays = await workDayRepository.GetAllAsync();
                   return workDays;
               });


            Field<WorkDayResponseType>("GetWorkDay")
               .Arguments(new QueryArguments(new QueryArgument<GuidGraphType> { Name = "id" }))
               .ResolveAsync(async context =>
               {
                   var workDay = await workDayRepository.GetByIdAsync(context.GetArgument<Guid>("id"));

                   return workDay;
               });
        }
    }
}
