using Ninject;
using Ninject.Extensions.Conventions;

namespace HolidayBookingWeb
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