"use strict";
// Declare variables
var $,
    Vue,
    accountUsers = [],
    createBoolean = false,
    currentUser,
    datetime,
    fadeTime = 500,
    four = 4,
    getTags = "",
    idAttr,
    loggedIn = false,
    notValid = false,
    numEvents = 0,
    one = 1,
    storedEvents = [],
    strAlert = "<div class='alert alert-success alert-dismissible fade in' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>×</span></button>",
    strLogIn = "Successfully Signed In!</div>",
    strLogOut = "Successfully Signed Out!</div>",
    strReg = "Successfully registered!</div>",
    strTags,
    ten = 10,
    three = 3,
    timeoutID = [],
    timerDelay = 1000,
    timerMS = 2500,
    two = 2,
    userLogged = ["", false, "", ""],
    value,
    zero = 0;

// Local Storage (get object)
Storage.prototype.getObject = function (key) {
    value = this.getItem(key);


    return value && JSON.parse(value);
};

// Local Storage (set object)
Storage.prototype.setObject = function (key, val) {
    this.setItem(key, JSON.stringify(val));
};

// Capitalize any first letters (function)
String.prototype.capitalize = function () {
    return this.charAt(zero).toUpperCase() + this.slice(one);
};

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

// Define our html templates for Event & Login forms
var templateEvent = `
<div class="modal-mask" v-show="show" transition="modal">
    <div class="modal-wrapper">
        <div class=modal-container>
            <div class=modal-body>
                <div class='small' @click="show = false">close</div>
                <div class=card>
                    <h1 class=title>Event Planner</h1>
                    <form v-on:submit.prevent>
                        <div class=input-container>
                            <input id=event-name required v-model="event.name" autofocus title="Required! - 'Name the event'" autocomplete="off" class="toolTip event-required" data-trigger="manual">
                            <label for=event-name>Event name</label>
                            <div class=bar>
                            </div>
                            <p class="tag-tip">e.g. 'Web development Workshop'</p>
                        </div>
                        <div class="input-group input-daterange" id="date">
                            <p class="time-label" for="date1">Start time</p>
                            <input id="date1" size="16" type="text" placeholder="` + datetime + `  @  11:30 AM" value="" readonly class="form-control form_datetime event-required toolTip" v-model="event.date1" required title="Required! - 'Start date & time'" data-trigger="manual">
                            <p class="time-label" for="date2">End time</p>
                            <input id="date2" size="16" type="text" placeholder="` + datetime + `  @  4:30 PM" value="" readonly class="form-control form_datetime event-required toolTip" v-model="event.date2" required title="Required! - 'End date & time'" data-trigger="manual">
                        </div>
                        <p class="time-label" for="select-input">Type of Event</p>
                        <select v-model="event.eventType" title="Required! - 'Type of event'" autocomplete="off" required id="select-input" class="toolTip event-required" data-trigger="manual" onfocusout="eventValidation('#select-input')">
                            <option selected value="">Select an event</option>
                            <option value="Meet-up">Meet-up</option>
                            <option value="Birthday">Birthday</option>
                            <option value="Conference">Conference</option>
                            <option value="Fair">Fair</option>
                            <option value="Other">Other</option>
                            <option value="Party">Party</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Social">Social</option>
                            <option value="Wedding">Wedding</option>
                        </select>
                        <div class=input-container>
                            <input id=event-host required v-model="event.host" title="Required! - 'Add a host name'" autocomplete="off" class="toolTip event-required" data-trigger="manual">
                            <label for=event-host>Host name</label>
                            <div class=bar></div>
                            <p class="tag-tip">individual’s name or an organization</p>
                        </div>
                        <div class=input-container>
                            <input class="type-zone toolTip" v-on:keyup="keyUp" id="guest" autocomplete="off" title="Required! - 'Add at least one guest'" class="toolTip" data-trigger="manual">
                            <label id="label-guest" for="guest">Guest list</label>
                            <div class=bar></div>
                            <p class="tag-tip">use a 'comma ,' or 'enter' to add a guest name</p>
                        </div>
                        <div class=input-container>
                            <input class="event-required" id="guestHidden" type="hidden" required v-model="event.guest">
                            <div id="tagList"></div>
                        </div>
                        <div class=input-container>
                            <input id=location required v-model="event.location" title="Required! - 'Add an address of event'" autocomplete="off" class="toolTip event-required" data-trigger="manual">
                            <label for=location>Location</label>
                            <div class=bar></div>
                            <p class="tag-tip">e.g. 'Room 203, Block B, Oxford University'</p>
                        </div>
                        <div class=input-container>
                            <textarea id="description" class="form-control" id=textarea v-model="event.description" name="description" rows="1"></textarea>
                            <label class="textLabel" for=description>Description</label>
                            <div class=bar></div>
                        </div>
                        <div class=button-container>
                            <button v-on:click.prevent="addEvent"><span>Add</span></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>`;

var templateLogin = `
<div class="modal-mask" v-show="show" transition="modal">
    <!--LOGIN FORM-->
    <div class="modal-wrapper" id="login-form">
        <div class=modal-container>
            <div class="item active">
                <div class=modal-body>
                    <div class='small' @click="show = false">close</div>
                    <div class=card>
                        <h1 class=title>Log In</h1>
                        <form v-on:submit.prevent class="formReg" id="logForm">
                            <div class=input-container>
                                <input class="emailLog clearInput emailValid" required name="email" type="email" autofocus v-model="userLogin.email" id="login-name">
                                <label for=email>Email</label>
                                <div class=bar></div>
                            </div>
                            <div class=input-container>
                                <input id="passwordLog" class="clearInput" required name="password" type="password" v-model="userLogin.password" id="password-log">
                                <label for=password-log>Password</label>
                                <div class=bar id="validForm"></div>
                            </div>
                            <div class=button-container>
                                <button v-on:click="login(0)"><span>Login</span></button>
                            </div>
                            <div class="footer login"><a @click.prevent="$parent.showModalSignUp" class="login-a">Create Account</a></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--REGISTER-->
    <div class="modal-wrapper" id="register-form">
        <div class=modal-container>
            <div class="item">
                <div class=modal-body>
                    <div class='small' @click="show = false">close</div>
                    <div class=card>
                        <h1 class=title>Register</h1>
                        <form v-on:submit.prevent class="formReg" id="regForm">
                            <div class=input-container>
                                <input class="clearInput registerReq" id="name" name="fname" required v-model="register.fname" autofocus>
                                <span class="glyphicon form-control-feedback" id="name1"></span>
                                <label for=fname>First name</label>
                                <div class=bar></div>
                            </div>
                            <div class=input-container>
                                <input class="clearInput registerReq" id="lname" name="lname" required v-model="register.lname">
                                <span class="glyphicon form-control-feedback" id="lname1"></span>
                                <label for=lname>Last name</label>
                                <div class=bar></div>
                            </div>
                            <div class=input-container>
                                <input class="clearInput registerReq emailValid" id=email required v-model="register.email" type="email" name="email">
                                <span class="glyphicon form-control-feedback" id="email1"></span>
                                <label for=email>Email</label>
                                <div class=bar>
                                </div>
                            </div>
                            <div class=input-container>
                                <input class="clearInput registerReq" id="password" name="password" required v-model="register.password" type="password">
                                    <span class="glyphicon form-control-feedback" id="password1"></span>
                                    <label for=password>Password</label>
                                <div class=bar></div>
                            </div>
                            <div class=input-container>
                                <input class="clearInput" name="optional" id="register-organization" v-model="register.organization" autocomplete="off" placeholder="e.g. Google company">
                                <label for=optional>Organization</label>
                                <div class=bar id="validForm2"></div>
                            </div>
                            <div class=button-container>
                                <button v-on:click="create"><span>Create</span></button>
                            </div>
                            <div class="footer login"><a @click.prevent="$parent.showModalLogin" class="login-a">or login</a></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

// Custom validation for event adding
var eventValidation = function (event) {
    // Detect if there are any guest tags added
    var eventValue = $(event).val(),
        guestHidden = "",
        guestInput = $("#guest").val(),
        guestType = $(event).attr("id"),
        passEvent = event;

    // if focusing on guest list with focusout
    if (guestType === "guest") {
        // Update guestHidden from the taglist
        guestHidden = $("#tagList").tagging("getTags");
        $("#guestHidden").val(guestHidden);
        // put label down
        $("#label-guest").removeClass("label-guest");
        // Leave the label up
        if ($(event).val() !== "") {
            $("#label-guest").addClass("label-guest");
        }
    }
    // if focusing on guest list with addbutton
    if (guestType === "guestHidden") {
        $("#guest").focus();
        passEvent = "#guest";
    }

    // Show tooltip & x-icon then run a timeout
    if (!eventValue && !guestHidden.length) {
        if (guestInput) {
            $("#guest").attr("title", "Press 'enter' or 'comma' to add guest!");
        }
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
    $("#guest").attr("title", "Required! - 'Add at least one guest'");
};

// Our event child component
Vue.component("event-modal", {
    "template": templateEvent,
    "props": {
        "show": {
            "type": Boolean,
            "required": true,
            "twoWay": true
        }
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
            $("#guestHidden").val(strTags);
        },
        // Adds an event to the existing events array
        "addEvent": function () {
            var addEvent = false;

            $(".event-required").each(function () {
                getTags = $("#tagList").tagging("getTags");
                $("#guestHidden").val(getTags);
                if ($(this).val() === "") {
                    addEvent = false;
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
                this.event.date2 = document.getElementById("date2").value;

                // We pass the event data to the parent component
                this.$dispatch("event-data", this.event);
                // We reset the form, 'name' resets all text inputs
                this.event = {
                    "name": "",
                    "date1": datetime + "  @  11:30 AM",
                    "date2": datetime + "  @  4:30 PM",
                    "eventType": ""
                };
                $("#tagList").tagging("removeAll");
                if (!numEvents) {
                    this.$parent.addBox();
                }
                numEvents += one;
            }
        }
    }
});

// Our Login child component
Vue.component("login-modal", {
    "template": templateLogin,
    "props": {
        "show": {
            "type": Boolean,
            "required": true,
            "twoWay": true
        }
    },
    "methods": {
        "login": function (arg) {
            // Remove any error logs first
            $(".help-block").remove();
            var userEmail,
                userPassword;

            if (!arg) {
                userEmail = this.userLogin.email.toLowerCase();
                userPassword = this.userLogin.password;
            }

            // Login matches email & password to sign in
            for (var i = 0; i < accountUsers.length; i++) {
                if (accountUsers[i].email === userEmail || accountUsers[i].email === arg[zero]) {
                    if (accountUsers[i].password === userPassword || accountUsers[i].password === arg[one]) {
                        // set the current logged in user
                        userLogged = [accountUsers[i].email, true, accountUsers[i].fname, i, accountUsers[i].password];
                        localStorage.setObject("logged", userLogged);
                        // retrieve any events previously stored from user
                        storedEvents = accountUsers[i].events;
                        // load all events from users
                        this.$parent.eventLists = storedEvents;
                        numEvents = storedEvents.length;
                        // remove the add box
                        if (numEvents >= one) {
                            this.$parent.addBox();
                        }
                        // logged into true (modal)
                        loggedIn = true;
                        // add the username to nabar
                        this.$parent.navLogName = userLogged[two] + " - Sign out";
                        $(".alter").empty();

                        // clear the input
                        $(".clearInput").each(function () {
                            $(this).val("");
                        });

                        // hide the modal
                        this.$parent.hideModals();
                        // success login
                        $(".mid-section").prepend(strAlert + strLogIn);
                        // remove alert
                        this.$parent.alertRemove();
                        $(".help-block-2").remove();
                        notValid = false;

                        return true;
                    }
                }
            }

            if (userEmail && userPassword && !notValid) {
                notValid = true;
                $("#validForm").prepend("<span class='help-block-2'>Email or password does not match.</span>");
            }

            return false;
        },
        "create": function () {
            $(".help-block").remove();
            if (createBoolean) {
                // Remove any error logs first
                var organization,
                    regEmail = this.register.email.toLowerCase(),
                    regFname = this.register.fname.capitalize(),
                    regLname = this.register.lname.capitalize();

                // Check through all accounts created on device
                for (var i = 0; i < accountUsers.length; i++) {
                    // disallow to create account with same email
                    if (regEmail === accountUsers[i].email) {
                        if (!notValid) {
                            notValid = true;
                            $("#validForm2").prepend("<span class='help-block-2'>Email account already exists</span>");
                        }

                        return false;
                    }
                }
                if (this.register.organization !== true) {
                    organization = "";
                }
                var registerUser = {
                    "fname": regFname,
                    "lname": regLname,
                    "email": regEmail,
                    "password": this.register.password,
                    "organization": organization,
                    "events": []
                };

                // create a new account if no matching email in database
                accountUsers.push(registerUser);
                localStorage.setObject("user", accountUsers);

                $(".mid-section").prepend(strAlert + strReg);
                this.$parent.alertRemove();

                // clear inputs
                $(".clearInput").each(function () {
                    $(this).val("");
                });
                // hide the modal
                this.$parent.hideModals();
                $(".help-block-2").remove();

                $(".form-control-feedback").removeClass("glyphicon-ok");

                // reset variable
                createBoolean = false;
            }

            return true;
        }
    }
});

// initialize Vue object (parent)
var initVue = new Vue({
    "el": "#app",
    "data": {
        "showEvent": false,
        "showLogin": false,
        "eventLists": [],
        "navLogName": "",
        "signUp": "Sign Up",
        "logIn": "Log In"
    },
    "events": {
        "event-data": function (data) {
            // Recieving event data, and pushing into array database
            this.eventLists.push(data);
            // Store all events into users local database
            accountUsers[userLogged[three]].events = this.eventLists;
            localStorage.setObject("user", accountUsers);
            this.showEvent = false;
        }
    },
    "methods": {
        "showModalEvent": function () {
            if (loggedIn) {
                this.showEvent = true;
                setTimeout(function () {
                    $("#event-name").focus();
                }, one);
            } else {
                this.showLogin = true;
                $("#login-form").fadeIn(fadeTime);
                $("#register-form").hide();
            }
        },
        "showModalLogin": function () {
            this.showLogin = true;
            $("#login-form").fadeIn(fadeTime);
            $("#register-form").hide();
            setTimeout(function () {
                $("#login-name").focus();
            }, one);
        },
        "showModalSignUp": function () {
            this.showLogin = true;
            $("#register-form").fadeIn(fadeTime);
            $("#login-form").hide();
            setTimeout(function () {
                $("#name").focus();
            }, one);
        },
        "hideModals": function () {
            this.showLogin = false;
            $("#register-form").hide();
            $("#login-form").hide();
        },
        "deleteEvent": function (index) {
            this.eventLists.splice(index, one);
            // Store all events into users local database
            accountUsers[userLogged[three]].events = this.eventLists;
            localStorage.setObject("user", accountUsers);
            numEvents -= one;
            if (!numEvents) {
                $(".change").toggleClass("invisible add-box");
                $(".removeEvent").remove();
            }
        },
        "signOut": function () {
            // append signin & register buttons
            $("#signUp").append("<a href='#'>Sign Up</a>");
            $("#logIn").append("<a href='#'>Log In</a>");

            // success log out
            $(".mid-section").prepend(strAlert + strLogOut);
            this.alertRemove();
            // remove name & signout button
            this.navLogName = "";
            // sign off
            loggedIn = false;
            userLogged[one] = false;
            localStorage.setObject("logged", userLogged);
            this.eventLists = [];
            if (numEvents) {
                $(".change").toggleClass("invisible add-box");
                $(".removeEvent").remove();
            }
            // reset numEvents
            numEvents = 0;
        },
        "alertRemove": function () {
            $(".alert").delay(timerDelay).fadeOut(fadeTime);
        },
        "addBox": function () {
            $(".navEvent").append("<a href='#' class='removeEvent'>Add Event</a>");
            $(".change").toggleClass("add-box invisible");
        }
    },
    "ready": function () {
        // initalize tags
        $("#tagList").tagging();

        // initalize calendar
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

            $("#date2").attr("placeholder", dateStart);

            if (dateStart > dateEnd) {
                $("#date2").attr("placeholder", dateStart);
            }
        });

        if (localStorage.getObject("user") !== null) {
            // get all the users from the database
            accountUsers = localStorage.getObject("user");
        }
        currentUser = localStorage.getObject("logged");

        // signIn on last user & load respective events
        if (currentUser !== null) {
            if (currentUser[one]) {
                loggedIn = true;
                this.navLogName = currentUser[two] + " - Sign out";
                $(".alter").empty();

                var autoLoginData = [currentUser[zero], currentUser[four]];

                this.$children[one].login(autoLoginData);
            }
        }
    }
});

// State the rules and functions for validation plugin
var validateRules = {
    "rules": {
        "fname": {
            "noSpaceStart": true,
            "minlength": 3,
            "maxlength": 15,
            "required": true,
            "noSpaceEnd": true
        },
        "lname": {
            "noSpaceStart": true,
            "minlength": 3,
            "maxlength": 15,
            "required": true,
            "noSpaceEnd": true
        },
        "password": {
            "noSpaceStart": true,
            "oneDigit": true,
            "oneLowercase": true,
            "oneUppercase": true,
            "minlength": 7,
            "maxlength": 20,
            "required": true,
            "noSpaceEnd": true
        }
    },
    "highlight": function (element) {
        idAttr = "#" + $(element).attr("id") + "1";

        $(element).closest(".form-group").removeClass("has-success").addClass("has-error");
        $(idAttr).removeClass("glyphicon-ok").addClass("glyphicon-remove");
    },
    "unhighlight": function (element) {
        idAttr = "#" + $(element).attr("id") + "1";

        $(element).closest(".form-group").removeClass("has-error").addClass("has-success");
        $(idAttr).removeClass("glyphicon-remove").addClass("glyphicon-ok");
    },
    "errorElement": "span",
    "errorClass": "help-block",
    "errorPlacement": function (error, element) {
        // remove any help blocks first
        $(".help-block").remove();
        var valueInputPass;

        if (element.length) {
            error.insertAfter(element);
            valueInputPass = $("#passwordLog").val();
        }

        if (valueInputPass === "") {
            notValid = false;
            $(".help-block-2").remove();
        }
    },
    "submitHandler": function () {
        createBoolean = true;
        if (this.errorContext[zero].length !== four) {
            initVue.$children[one].create();
        }
    }
};

// Focusout event listener
$("input").focusout(function () {
    eventValidation(this);
});

// Force label up, from valid css bug
$(".emailValid").each(function () {
    $(this).focusout(function () {
        if ($(this).val() !== "") {
            $(this).siblings("label").css("transform", "translate(-12%, -40%) scale(0.75)");
        } else if ($(this).val() === "") {
            $(this).siblings("label").css("transform", "");
        }
    });
});

// Submit handlers & validators for regsiter and login form
$("#regForm").submit(function (e) {
    e.preventDefault();
}).validate(validateRules);

$("#logForm").submit(function (e) {
    e.preventDefault();
}).validate(validateRules);

// use/run variables and functions
initVue;
