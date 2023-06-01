module.exports = {
  apps : [{
    name      : "be-sikopi",
    cwd       : "C:\EnricoJoe\Belajar\Node\kopi",
    script    : "node build\server.js",
    exec_mode : "cluster",
    instance  : 0,
    env_production: {
       NODE_ENV: "production",
       SIKOPI_DATABASE_URL: "postgresql://sikopi_admin:i&Yk8j%2vFY6GJx@localhost:5432/sikopi"
    },
    env_development: {
       NODE_ENV: "development",
       SIKOPI_DATABASE_URL: "postgresql://doadmin:AVNS_G_oNOuXHYB1aWz22CGK@db-postgresql-sgp1-39384-do-user-9602043-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require"
    }
  }]
}
