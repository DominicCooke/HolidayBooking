﻿using System;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using HolidayBookingWeb;
using HolidayBookingWeb.DataAccess.Identity;
using HolidayBookingWeb.DataAccess.Identity.Providers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Owin;

[assembly: OwinStartup(typeof(Startup))]

namespace HolidayBookingWeb
{
    public class Startup
    {
        public static Func<RoleManager<IdentityRole>> RoleManagerFactory { get; private set; }
        public static Func<UserManager<IdentityEmployee>> UserManagerFactory { get; private set; }

        public void Configuration(IAppBuilder app)
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            MappingConfig.RegisterMapping();

            ConfigureOAuth(app);
            app.UseCors(CorsOptions.AllowAll);

            UserManagerFactory = () =>
            {
                var usermanager =
                    new UserManager<IdentityEmployee>(new UserStore<IdentityEmployee>(new IdentityContext()));

                usermanager.UserValidator = new UserValidator<IdentityEmployee>(usermanager)
                {
                    AllowOnlyAlphanumericUserNames = false
                };

                return usermanager;
            };
            RoleManagerFactory = () =>
            {
                var rolemanager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new IdentityContext()));
                return rolemanager;
            };
        }

        public void ConfigureOAuth(IAppBuilder app)
        {
            var oAuthServerOptions = new OAuthAuthorizationServerOptions
            {
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(300),
                Provider = new SimpleAuthorizationServerProvider()
            };

            app.UseOAuthAuthorizationServer(oAuthServerOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                CookieName = "Login Cookie",
                CookieDomain = "localhost"

                // CookieDomain = ".192.133.244.6"
            });
        }
    }
}