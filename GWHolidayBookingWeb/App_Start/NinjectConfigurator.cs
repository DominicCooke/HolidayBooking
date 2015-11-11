using Ninject;
using Ninject.Extensions.Conventions;

namespace GWHolidayBookingWeb.App_Start
{
    public class NinjectConfigurator
    {
        public void Configure(IKernel kernel)
        {
            kernel.Bind(x => x
                .FromAssembliesMatching("GWHolidayBookingWeb.*.dll")
                .SelectAllClasses()
                .BindDefaultInterface());
        }
    }
}