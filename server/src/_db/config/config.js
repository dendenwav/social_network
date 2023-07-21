module.exports = {
  development: {
    url: 'postgres://social_network_admin:Gnp0cQ3ntRfZtGxhp0MC@127.0.0.1:5432/social_network_db',
    dialect: 'postgres'
  },
  test: {
    url: '127.0.0.1',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};