﻿using Dapper;
using timetracker.Server.Database;

namespace timetracker.Server.Repositories
{
    public class DapperRepository<T> : IRepository<T>
    {
        protected readonly ISqlConnectionFactory _connectionFactory;
        protected readonly string _tableName;
        public DapperRepository(ISqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
            _tableName = $"{typeof(T).Name}";
        }
        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            using var connection = _connectionFactory.Create();
            var sql = $"SELECT * FROM {_tableName}";
            return await connection.QueryAsync<T>(sql);
        }
        public virtual async Task<T> GetByIdAsync(Guid id)
        {
            using var connection = _connectionFactory.Create();
            var sql = $"SELECT * FROM {_tableName} WHERE Id = @Id";
            var user = await connection.QuerySingleOrDefaultAsync<T>(sql, new { Id = id });
            return user;
        }
        public virtual async Task<T> AddAsync(T entity)
        {
            using var connection = _connectionFactory.Create();

            var entityType = typeof(T);
            var properties = entityType.GetProperties()
                .Where(p => p.Name != "Id");

            var columns = string.Join(", ", properties.Select(p => p.Name));
            var parameters = string.Join(", ", properties.Select(p => "@" + p.Name));

            var sql = $"INSERT INTO {_tableName} ({columns}) OUTPUT INSERTED.* VALUES ({parameters})";

            var parameterValues = new DynamicParameters();
            foreach (var property in properties)
                parameterValues.Add("@" + property.Name, property.GetValue(entity));

            var insertedEntity = await connection.QuerySingleAsync<T>(sql, parameterValues);
            return insertedEntity;
        }
        public virtual async Task UpdateAsync(T entity)
        {
            using var connection = _connectionFactory.Create();
            var properties = typeof(T).GetProperties()
                                       .Where(p => p.Name != "Id")
                                       .Select(p => $"{p.Name} = @{p.Name}");

            var setClause = string.Join(", ", properties);
            var sql = $"UPDATE {_tableName} SET {setClause} WHERE Id = @Id";

            await connection.ExecuteAsync(sql, entity);
        }
        public virtual async Task DeleteAsync(Guid id)
        {
            using var connection = _connectionFactory.Create();
            var sql = $"DELETE FROM {_tableName} WHERE Id = @Id";
            await connection.ExecuteAsync(sql, new { Id = id });
        }
    }
}
