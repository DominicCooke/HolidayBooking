using System.Web.Http;
using Newtonsoft.Json;

namespace HolidayBookingWeb
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;

            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute("DefaultApi", "api/{controller}/{action}/{id}",
                new {id = RouteParameter.Optional}
                );
        }
    }
}