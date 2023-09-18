export default () => ({
  port: process.env.PORT,
  accessTokenSecret: process.env.ACCESSTOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESHTOKEN_SECRET,
  cache_ttl: process.env.CACHE_TTL,
  cache_max: process.env.CACHE_MAX,
  se_user: process.env.SE_USER,
  se_password: process.env.SE_PASSWORD,
});
