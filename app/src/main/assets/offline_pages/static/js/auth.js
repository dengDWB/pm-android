$(function() {

    var username = $.cookie('username');
    var password = $.cookie('password');

   
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        }
    });
});