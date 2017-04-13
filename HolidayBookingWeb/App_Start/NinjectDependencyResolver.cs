using System;
using System.Collections.Generic;
using System.Web.Http.Dependencies;
using Ninject;

namespace HolidayBookingWeb
{
    public class NinjectDependencyResolver : IDependencyResolver
    {
        public NinjectDependencyResolver(IKernel kernel)
        {
            Kernel = kernel;
        }

        public IKernel Kernel { get; }

        public IDependencyScope BeginScope()
        {
            return this;
        }

        public object GetService(Type serviceType)
        {
            return Kernel.TryGet(serviceType);
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return Kernel.GetAll(serviceType);
        }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}