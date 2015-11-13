using System;
using System.Data.Entity.Migrations;
using GWHolidayBookingWeb.DataAccess.Identity;
using System.Linq;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity;

namespace GWHolidayBookingWeb.Migrations.Identity
{
    internal sealed class ConfigIdentity : DbMigrationsConfiguration<IdentityContext>
    {
        public ConfigIdentity()
        {
            AutomaticMigrationsEnabled = true;
            MigrationsDirectory = @"Migrations\Identity";
            ContextKey = "GWHolidayBookingWeb.DataAccess.Identity.AuthContext";
        }

        protected override void Seed(IdentityContext context)
        {
            var userManager = new UserManager<IdentityEmployee>(new UserStore<IdentityEmployee>(context));
            IdentityEmployee test = new IdentityEmployee();
            test.UserName = "Dom";


            userManager.Create(test, "123123");
        }
    }
}
