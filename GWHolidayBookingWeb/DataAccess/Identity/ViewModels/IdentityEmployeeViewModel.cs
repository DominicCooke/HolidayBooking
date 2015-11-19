using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GWHol.Web.ViewModels
{
    public class IdentityUserViewModel
    {
        public string IdentityId { get; set; }
        public string Username { get; set; }
        public List<IdentityRole> RoleViewModels { get; set; }
    }
}