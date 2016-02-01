helperService = function () {
    "use strict";
    return {
        guid: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
              s4() + '-' + s4() + s4() + s4();
        },
        combineHolidayBookings: function (holidayBooking) {
            var consolidatedHolidayBookings = [];
            var startFlag = true;
            var duplicateHolidayId = null;
            while (holidayBooking.length !== 1) {
                if (holidayBooking[0].StartDate.day() + 1 === holidayBooking[1].StartDate.day() && startFlag === true && holidayBooking[0].BookingStatus === holidayBooking[1].BookingStatus) {
                    holidayBooking[0].EndDate = holidayBooking[1].StartDate;
                    holidayBooking[0].AllowanceDays++;
                    if (holidayBooking.length === 2) {
                        consolidatedHolidayBookings.push(holidayBooking[0]);
                    }
                    holidayBooking.splice(1, 1);
                    startFlag = false;
                } else if (holidayBooking[0].EndDate.day() + 1 === holidayBooking[1].StartDate.day() && startFlag === false && holidayBooking[0].BookingStatus === holidayBooking[1].BookingStatus) {
                    holidayBooking[0].EndDate = holidayBooking[1].StartDate;
                    holidayBooking[0].AllowanceDays++;
                    if (holidayBooking.length === 2) {
                        consolidatedHolidayBookings.push(holidayBooking[0]);
                    }
                    holidayBooking.splice(1, 1);
                } else if (holidayBooking[0].EndDate.day() + 1 === holidayBooking[1].StartDate.day() && holidayBooking[0].BookingStatus !== holidayBooking[1].BookingStatus) {
                    holidayBooking[1].HolidayId = helperService.guid();
                    consolidatedHolidayBookings.push(holidayBooking[0]);
                    if (holidayBooking.length === 2) {
                        consolidatedHolidayBookings.push(holidayBooking[1]);
                    }
                    holidayBooking.splice(0, 1);
                    startFlag = true;
                } else {
                    if (duplicateHolidayId === holidayBooking[0].HolidayId) {
                        holidayBooking[0].HolidayId = helperService.guid();
                    } else {
                        duplicateHolidayId = holidayBooking[0].HolidayId;
                    }
                    consolidatedHolidayBookings.push(holidayBooking[0]);
                    if (holidayBooking.length === 2) {
                        consolidatedHolidayBookings.push(holidayBooking[1]);
                    }
                    holidayBooking.splice(0, 1);
                    startFlag = true;
                }
            }
            return consolidatedHolidayBookings;
        },
        getListOfTeamMembers: function (holidayArray) {
            var listOfTeamMembers = [];
            for (var i = 0; i < holidayArray.length; i++) {
                listOfTeamMembers.push({
                    Name: holidayArray[i].FirstName + " " + holidayArray[i].LastName,
                    StaffId: holidayArray[i].StaffId
                });
            }
            return listOfTeamMembers;
        },
        unmergeHolidayBookings: function (holidayBookingsArray) {
            for (var j = 0; j < holidayBookingsArray.length; j++) {
                while (holidayBookingsArray[j].StartDate.day() !== holidayBookingsArray[j].EndDate.day()) {
                    var copyOfHolidayBooking = _.cloneDeep(holidayBookingsArray[j]);
                    copyOfHolidayBooking.EndDate = moment(copyOfHolidayBooking.EndDate);
                    copyOfHolidayBooking.StartDate = copyOfHolidayBooking.EndDate;
                    holidayBookingsArray.push(copyOfHolidayBooking);
                    holidayBookingsArray[j].EndDate = holidayBookingsArray[j].EndDate.subtract(1, "days");
                }
            }
        },
        parseDateTimeToMoment: function (holidayBookingsArray) {
            for (var j = 0; j < holidayBookingsArray.length; j++) {
                var teamHolidayBookings = holidayBookingsArray[j];
                if (typeof teamHolidayBookings.StartDate === "object") {
                    teamHolidayBookings.StartDate = moment(teamHolidayBookings.StartDate, "YYYY-MM-DD-Z");
                    teamHolidayBookings.EndDate = moment(teamHolidayBookings.EndDate, "YYYY-MM-DD Z");
                } else {
                    teamHolidayBookings.StartDate = moment(teamHolidayBookings.StartDate + "-+0000", "YYYY-MM-DD-Z");
                    teamHolidayBookings.EndDate = moment(teamHolidayBookings.EndDate + "-+0000", "YYYY-MM-DD Z");
                }
            }
        },
        setAllowanceDaysOfUnmergedHolidays: function (holidayArray) {
            for (var j = 0; j < holidayArray.HolidayBookings.length; j++) {
                holidayArray.HolidayBookings[j].AllowanceDays = 1;
            }
        }
    };
}