using System.Web.Http.Dependencies;
using Ninject;

namespace GWHolidayBookingWeb.App_Start
{
    public class NinjectResolver : NinjectScope, IDependencyResolver
    {
        private IKernel kernel;

        public NinjectResolver(IKernel kernel)
            : base(kernel)
        {
            this.kernel = kernel;
        }

        public IDependencyScope BeginScope()
        {
            return new NinjectScope(kernel);
        }
    }
}
