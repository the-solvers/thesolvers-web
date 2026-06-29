import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admindashboard/", "/admin-auth/", "/createadminblogs/", "/createbuilt/", "/createcomingsoon/", "/api/"],
      },
    ],
    sitemap: "https://thesolvers.online/sitemap.xml",
    host: "https://thesolvers.online",
  };
}
