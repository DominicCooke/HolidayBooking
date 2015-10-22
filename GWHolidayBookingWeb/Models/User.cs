using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Web;

namespace GWHolidayBookingWeb.Models
{
    public class User
    {
        [Key]
        public int StaffNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int HolidayAllowance { get; set; }
        public int RemainingAllowance { get; set; }
        public List<HolidayBooking> HolidayBookings { get; set; }
        public Boolean isVisible { get; set; }


        public static List<User> GetAll()
        {
            using (var db = new UserContext())
            {
                var userList = db.Users.ToList();

                for (int i = 0; i < userList.Count; i++)
                {
                    userList[i].HolidayBookings = Models.HolidayBooking.GetAll(userList[i].StaffNumber);
                }
                return userList;
            }
        }
        public static User GetById(int StaffNumber)
        {
            using (var db = new UserContext())
            {
                var user = db.Users.FirstOrDefault(x => x.StaffNumber == StaffNumber);
                user.HolidayBookings = Models.HolidayBooking.GetAll(user.StaffNumber);
                return user;
            }
        }

        public static void SaveAll(User User)
        {
            using (var db = new UserContext())
            {
                //var existing = (User) GetById(User.StaffNumber);
                User contextUser = db.Users.First(u => u.StaffNumber == User.StaffNumber);
                if (contextUser != null)
                {
                    contextUser = User;
                }
                else
                {
                    db.Users.Add(User);
                }
                //db.Entry(existing).CurrentValues.SetValues(User);
                db.SaveChanges();
            }
        }

        public void Save()
        {
            using (var db = new UserContext())
            {
                db.Users.Add(this);
                db.SaveChanges();
            }
        }
    }
}