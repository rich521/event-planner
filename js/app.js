"use strict";
// Declare variables
var $,
    Vue,
    datetime,
    getTags = "",
    numEvents = 0,
    one = 1,
    strTags,
    ten = 10,
    timeoutID = [],
    timerMS = 1800;

// get the current date and format it
var initDate = function () {
    var today = new Date();

    var day = today.getDate(),
        month = today.getMonth() + one,
        year = today.getFullYear();

    if (day < ten) {
        day = "0" + day
    }
    if (month < ten) {
        month = "0" + month
    }
    datetime = year + "-" + month + "-" + day;
};

initDate();

// Replace the validation UI for all forms
// var forms = document.querySelectorAll("form");

// for (var i = 0; i < forms.length; i++) {
//     forms[i].addEventListener("invalid", function (e) {
//         e.preventDefault();
//         console.log("ge");
//     }, true);
// }

// Validation functions
var eventValidation = function (event) {
    // Detect if there are any guest tags added
    var guestInput = "",
        hiddenEvent = $(event).attr("id").indexOf("guestInput"),
        passEvent = event;

    // Only focusout function apply's to this
    if (event === "#guest") {
        // Update guestInput from the taglist
        guestInput = $("#tagList").tagging("getTags");
        $("#label-guest").removeClass("label-guest");
        // Leave the label up
        if ($(event).val() !== "") {
            $("#label-guest").addClass("label-guest");
        }
    }
    // Only if the add button is clicked
    if (hiddenEvent > -one) {
        $("#guest").focus();
        passEvent = "#guest";
    }
    // Show tooltip then run a timeout
    if ($(passEvent).val() === "" && !guestInput.length) {
        $(passEvent).tooltip({
            "placement": "bottom"
        }).tooltip("show");
        timeoutID.push(window.setTimeout(function () {
            $(passEvent).tooltip("destroy");
            // clear respective timeouts running
            clearTimeout(this);
            timeoutID = [];
        }, timerMS));
    }
};

// initialize Vue object
var initVue = new Vue({
    "el": "#app",
    "data": {
        "eventLists": [],
        "datetime": datetime
    },
    "methods": {
        "keyUp": function () {
            // tag-input placed in hidden input with attr: v-model
            getTags = $("#tagList").tagging("getTags");
            for (var i = 0; i < getTags.length; i++) {
                getTags[i] = getTags[i].trim();
            }

            // Removes [] and middle spaces to single space
            strTags = getTags.join(", ").
            replace(/\s\s+/g, " ");

            // Required form
            $("#guestInput").val(strTags);
        },
        // Adds an event to the existing events array
        "addEvent": function (event) {
            var addEvent = false,
                ref = $("form").find("[required]");

            $(ref).each(function () {
                if ($(this).val() === "") {
                    addEvent = false;
                    event.preventDefault();

                    $(this).focus();
                    eventValidation(this);

                    return false;
                }
                addEvent = true;

                return true;
            });

            if (addEvent) {
                this.event.guest = strTags;
                if (typeof this.event.description !== "undefined") {
                    this.event.description = String("\"" + this.event.description + "\"");
                }
                this.eventLists.push(this.event);
                // We reset the form, 'name' resets all text inputs, and for others we do manually
                this.event = {
                    "name": "",
                    "date1": datetime + "  @  11:30 AM",
                    "date2": datetime + "  @  4:30 PM",
                    "eventType": ""
                };
                $("#tagList").tagging("removeAll");
                $("#myModal").modal("hide");
                numEvents += one;
                if (numEvents <= one) {
                    $(".topBtn").toggleClass("invisible showBtn");
                    $(".change").toggleClass("add-box invisible");
                }
            }
        },
        "deleteEvent": function (index) {
            this.eventLists.splice(index, one);
            numEvents -= one;
            if (!numEvents) {
                $(".change").toggleClass("invisible add-box");
                $(".topBtn").toggleClass("showBtn invisible");
            }
        }
    }
});

// bootstrap calendar widgit's settings and functions
var initCalendar = function () {
    $(".form_datetime").datetimepicker({
        "format": "yyyy-mm-dd  @  H:ii P",
        "weekStart": 1,
        "todayBtn": 1,
        "autoclose": 1,
        "todayHighlight": 1,
        "startView": 2,
        "forceParse": 0,
        "showMeridian": 1
    });

    $(".form_datetime").datetimepicker("setStartDate", datetime);

    $("#date1").datetimepicker().
    on("changeDate", function () {
        var dateEnd = $("#date2").val(),
            dateStart = $("#date1").val();

        $("#date2").datetimepicker("setStartDate", dateStart);

        if (dateStart > dateEnd) {
            document.getElementById("date2").value = dateStart;
        }
    });
};

var initTag = function () {
    $("#tagList").tagging();
};

// use/run variables and functions
initVue;
initCalendar();
initTag();
