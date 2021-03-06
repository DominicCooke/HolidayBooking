using System;
using System.Web;
using System.Web.Http;
using HolidayBookingWeb;
using HolidayBookingWeb.DataAccess;
using HolidayBookingWeb.DataAccess.Identity;
using HolidayBookingWeb.DataAccess.Repositories;
using HolidayBookingWeb.Services;
using Microsoft.Web.Infrastructure.DynamicModuleHelper;
using Ninject;
using Ninject.Web.Common;
using WebActivatorEx;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(NinjectWebCommon), "Start")]
[assembly: ApplicationShutdownMethod(typeof(NinjectWebCommon), "Stop")]

namespace HolidayBookingWeb
{
    public static class NinjectWebCommon
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        public static IKernel Kernel
        {
            get { return bootstrapper.Kernel; }
        }

        /// <summary>
        ///     Starts the application
        /// </summary>
        public static void Start()
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
            GlobalConfiguration.Configuration.DependencyResolver = new NinjectDependencyResolver(Kernel);
        }

        /// <summary>
        ///     Stops the application.
        /// </summary>
        public static void Stop()
        {
            bootstrapper.ShutDown();
        }

        /// <summary>
        ///     Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            try
            {
                kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

                RegisterServices(kernel);
                return kernel;
            }
            catch
            {
                kernel.Dispose();
                throw;
            }
        }

        /// <summary>
        ///     Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            kernel.Bind<IEmployeeContext>().To<EmployeeContext>().InRequestScope();

            kernel.Bind<IEmployeeDataService>().To<EmployeeDataService>().InRequestScope();
            kernel.Bind<IEmployeeRepository>().To<EmployeeRepository>().InRequestScope();

            kernel.Bind<ITeamDataService>().To<TeamDataService>().InRequestScope();
            kernel.Bind<ITeamRespository>().To<TeamRespository>().InRequestScope();

            kernel.Bind<IIdentityContext>().To<IdentityContext>().InRequestScope();
        }
    }
}