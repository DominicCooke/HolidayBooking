using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace GWHolidayBookingWeb.Models
{
    public class HolidayBooking
    {
        [Key]
        public int HolidayId { get; set; }
        public int StaffNumber { get; set; }
        [ForeignKey("StaffNumber")]
        public User User { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int AllowanceDays { get; set; }
        public BookingStatusEnum BookingStatus { get; set; }

        public static List<HolidayBooking> GetAll(int StaffNumber)
        {
            using (var db = new UserContext())
            {
                var userHolidayBookings = db.HolidayBookings.Where(x => x.StaffNumber == StaffNumber).ToList();
                return userHolidayBookings;
            }
        }
        public static HolidayBooking GetById(int HolidayId)
        {
            using (var db = new UserContext())
            {
                var HolidayBooking = db.HolidayBookings.FirstOrDefault(x => x.HolidayId == HolidayId);
                return HolidayBooking;
            }
        }
        public static void SaveAll(List<HolidayBooking> HolidayBooking)
        {
            using (var db = new UserContext())
            {
                for (int i = 0; i < HolidayBooking.Count; i++)
                {
                    var contextHolidayBooking2 = db.HolidayBookings.ToList();
                    var test= contextHolidayBooking2.FirstOrDefault(h => h.HolidayId == HolidayBooking[i].HolidayId);
                    var test2 = contextHolidayBooking2.First(h => h.HolidayId == HolidayBooking[i].HolidayId);
                    var contextHolidayBooking = db.HolidayBookings.ToList().FirstOrDefault(h => h.HolidayId == HolidayBooking[i].HolidayId);
                    if (contextHolidayBooking != null)
                    {
                        contextHolidayBooking = HolidayBooking[i];
                    }
                    else
                    {
                        db.HolidayBookings.Add(HolidayBooking[i]);
                    }




                    //var existing = (HolidayBooking)GetById(HolidayBooking[i].HolidayId);
                    //if (existing == null)
                    //    db.HolidayBookings.Add(HolidayBooking[i]);
                    //db.Entry(existing).CurrentValues.SetValues(HolidayBooking[i]);

                }
                db.SaveChanges();
            }
        }
    }

    public enum BookingStatusEnum
    {
        Pending = 0,
        Confirmed = 1,
        Cancelled = 2
    }
}