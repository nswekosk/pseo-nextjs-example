/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.VERCEL_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  exclude: ["/server-sitemap.xml"],
  robotsTxtOptions: {
    additionalSitemaps: [
      `${process.env.VERCEL_URL || "http://localhost:3000"}/server-sitemap.xml`,
    ],
  },
};
