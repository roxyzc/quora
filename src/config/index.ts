export default () => ({
  port: process.env.PORT,
  accessTokenSecret: process.env.ACCESSTOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESHTOKEN_SECRET,
});
