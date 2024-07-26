﻿using timetracker.Server.Application.Interfaces;
using timetracker.Server.Application.Services.Authentication;

namespace timetracker.Server.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(
            this IServiceCollection services,
            ConfigurationManager configuration)
        {
            services.Configure<JwtSettings>(configuration.GetSection("JWT"));
            services.Configure<PasswordHasherSettings>(configuration.GetSection("PasswordHasher"));

            services.AddSingleton<IJwtTokenUtils, JwtTokenUtils>();
            services.AddSingleton<IPasswordHasher, PasswordHasher>();

            return services;
        }
    }
}
