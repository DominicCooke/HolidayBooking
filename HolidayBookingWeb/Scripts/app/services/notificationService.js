notificationService = function() {
    "use strict";
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "5000",
        "hideDuration": "1500",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    return {
        generateNotification: function(type, message) {
            if (type == "success") {
                toastr.success(message);
            } else if (type == "warning") {
                toastr.warning(message);
            } else if (type == "error") {
                toastr.error(message);
            }
        }
    };
}