export default () => ({
    secret_jwt: process.env.SECRET,
    database_url: process.env.DATABASE_URL
})