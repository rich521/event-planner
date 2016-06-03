"use strict";var $,Vue,accountUsers=[],createBoolean=!1,currentUser,datetime,fadeTime=500,four=4,getTags="",idAttr,loggedIn=!1,notValid=!1,numEvents=0,one=1,storedEvents=[],strAlert="<div class='alert alert-success alert-dismissible fade in' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>×</span></button>",strLogIn="Successfully Signed In!</div>",strLogOut="Successfully Signed Out!</div>",strReg="Successfully registered!</div>",strTags,ten=10,three=3,timeoutID=[],timerDelay=1e3,timerMS=2500,two=2,userLogged=["",!1,"",""],value,zero=0;Storage.prototype.getObject=function(e){return value=this.getItem(e),value&&JSON.parse(value)},Storage.prototype.setObject=function(e,t){this.setItem(e,JSON.stringify(t))},String.prototype.capitalize=function(){return this.charAt(zero).toUpperCase()+this.slice(one)};var initDate=function(){var e=new Date,t=e.getDate(),n=e.getMonth()+one,a=e.getFullYear();ten>t&&(t="0"+t),ten>n&&(n="0"+n),datetime=a+"-"+n+"-"+t};initDate();var templateEvent='\n<div class="modal-mask" v-show="show" transition="modal">\n    <div class="modal-wrapper">\n        <div class=modal-container>\n            <div class=modal-body>\n                <div class=\'small\' @click="show = false">close</div>\n                <div class=card>\n                    <h1 class=title>Event Planner</h1>\n                    <form v-on:submit.prevent>\n                        <div class=input-container>\n                            <input id=event-name required v-model="event.name" autofocus title="Required! - \'Name the event\'" autocomplete="off" class="toolTip event-required" data-trigger="manual" data-placement="bottom">\n                            <label for=event-name>Event name</label>\n                            <div class=bar>\n                            </div>\n                            <p class="tag-tip">e.g. \'Web development Workshop\'</p>\n                        </div>\n                        <div class="input-group input-daterange">\n                            <label class="time-label" for="date1">Start time</label>\n                            <input id="date1" size="16" type="text" placeholder="Select start date" value="" readonly class="form-control form_datetime event-required toolTip" v-model="event.date1" required title="Required! - \'Start date & time\'" data-trigger="manual" data-placement="top">\n                        </div>\n                        <div class="input-group input-daterange">\n                            <label class="time-label" for="date2">End time</label>\n                            <input id="date2" size="16" type="text" placeholder="Select end date" value="" readonly class="form-control form_datetime event-required toolTip" v-model="event.date2" required title="Required! - \'End date & time\'" data-trigger="manual" data-placement="top">\n                        </div>\n                        <label class="time-label" for="select-input">Type of Event</label>\n                        <select v-model="event.eventType" title="Required! - \'Type of event\'" autocomplete="off" required id="select-input" class="toolTip event-required" data-trigger="manual" onfocusout="eventValidation(\'#select-input\')" data-placement="bottom">\n                            <option selected value="">Select an event</option>\n                            <option value="Meet-up">Meet-up</option>\n                            <option value="Birthday">Birthday</option>\n                            <option value="Conference">Conference</option>\n                            <option value="Fair">Fair</option>\n                            <option value="Other">Other</option>\n                            <option value="Party">Party</option>\n                            <option value="Seminar">Seminar</option>\n                            <option value="Social">Social</option>\n                            <option value="Wedding">Wedding</option>\n                        </select>\n                        <div class=input-container>\n                            <input id=event-host required v-model="event.host" title="Required! - \'Add a host name\'" autocomplete="off" class="toolTip event-required" data-trigger="manual" data-placement="bottom">\n                            <label for=event-host>Host name</label>\n                            <div class=bar></div>\n                            <p class="tag-tip">individual’s name or an organization</p>\n                        </div>\n                        <div class=input-container>\n                            <input class="type-zone toolTip" v-on:keyup="keyUp" id="guest" autocomplete="off" title="Required! - \'Add at least one guest\'" class="toolTip" data-trigger="manual" data-placement="bottom">\n                            <label id="label-guest" for="guest">Guest list</label>\n                            <div class=bar></div>\n                            <p class="tag-tip">use a \'comma ,\' or \'enter\' to add a guest name</p>\n                        </div>\n                        <div class=input-container>\n                            <input class="event-required" id="guestHidden" type="hidden" required v-model="event.guest" data-placement="bottom">\n                            <div id="tagList"></div>\n                        </div>\n                        <div class=input-container>\n                            <input id=location required v-model="event.location" title="Required! - \'Add an address of event\'" autocomplete="off" class="toolTip event-required" data-trigger="manual" data-placement="bottom">\n                            <label for=location>Location</label>\n                            <div class=bar></div>\n                            <p class="tag-tip">e.g. \'Room 203, Block B, Oxford University\'</p>\n                        </div>\n                        <div class=input-container>\n                            <textarea id="description" class="form-control" id=textarea v-model="event.description" name="description" rows="1"></textarea>\n                            <label class="textLabel" for=description>Description</label>\n                            <div class=bar></div>\n                        </div>\n                        <div class=button-container>\n                            <button v-on:click.prevent="addEvent"><span>Add</span></button>\n                        </div>\n                    </form>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>',templateLogin='\n<div class="modal-mask" v-show="show" transition="modal">\n    <!--LOGIN FORM-->\n    <div class="modal-wrapper" id="login-form">\n        <div class=modal-container>\n            <div class="item active">\n                <div class=modal-body>\n                    <div class=\'small\' @click="show = false">close</div>\n                    <div class=card>\n                        <h1 class=title>Log In</h1>\n                        <form v-on:submit.prevent class="formReg" id="logForm">\n                            <div class=input-container>\n                                <input class="emailLog clearInput emailValid" required name="email" type="email" autofocus v-model="userLogin.email" id="login-name">\n                                <label for=login-name>Email</label>\n                                <div class=bar></div>\n                            </div>\n                            <div class=input-container>\n                                <input id="passwordLog" class="clearInput" required name="password" type="password" v-model="userLogin.password" id="password-log">\n                                <label for=passwordLog>Password</label>\n                                <div class=bar id="validForm"></div>\n                            </div>\n                            <div class=button-container>\n                                <button v-on:click="login(0)"><span>Login</span></button>\n                            </div>\n                            <div class="footer login"><a @click.prevent="$parent.showModalSignUp" class="login-a">Create Account</a></div>\n                        </form>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <!--REGISTER-->\n    <div class="modal-wrapper" id="register-form">\n        <div class=modal-container>\n            <div class="item">\n                <div class=modal-body>\n                    <div class=\'small\' @click="show = false">close</div>\n                    <div class=card>\n                        <h1 class=title>Register</h1>\n                        <form v-on:submit.prevent class="formReg" id="regForm">\n                            <div class=input-container>\n                                <input class="clearInput registerReq" id="fname" name="fname" required v-model="register.fname" autofocus>\n                                <span class="glyphicon form-control-feedback" id="name1"></span>\n                                <label for=fname>First name</label>\n                                <div class=bar></div>\n                            </div>\n                            <div class=input-container>\n                                <input class="clearInput registerReq" id="lname" name="lname" required v-model="register.lname">\n                                <span class="glyphicon form-control-feedback" id="lname1"></span>\n                                <label for=lname>Last name</label>\n                                <div class=bar></div>\n                            </div>\n                            <div class=input-container>\n                                <input class="clearInput registerReq emailValid" id=email required v-model="register.email" type="email" name="email">\n                                <span class="glyphicon form-control-feedback" id="email1"></span>\n                                <label for=email>Email</label>\n                                <div class=bar>\n                                </div>\n                            </div>\n                            <div class=input-container>\n                                <input class="clearInput registerReq" id="password" name="password" required v-model="register.password" type="password">\n                                    <span class="glyphicon form-control-feedback" id="password1"></span>\n                                    <label for=password>Password</label>\n                                <div class=bar></div>\n                            </div>\n                            <div class=input-container>\n                                <input class="clearInput" name="optional" id="register-organization" v-model="register.organization" autocomplete="off" placeholder="e.g. Google company">\n                                <label for=register-organization>Organization</label>\n                                <div class=bar id="validForm2"></div>\n                            </div>\n                            <div class=button-container>\n                                <button v-on:click="create"><span>Create</span></button>\n                            </div>\n                            <div class="footer login"><a @click.prevent="$parent.showModalLogin" class="login-a">or login</a></div>\n                        </form>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n',eventValidation=function(e){var t=$(e).val(),n="",a=$("#guest").val(),i=$(e).attr("id"),o=e;"guest"===i&&(n=$("#tagList").tagging("getTags"),$("#guestHidden").val(n),$("#label-guest").removeClass("label-guest"),""!==$(e).val()&&$("#label-guest").addClass("label-guest")),"guestHidden"===i&&($("#guest").focus(),o="#guest"),t||n.length||(a&&$("#guest").attr("title","Press 'enter' or 'comma' to add guest!"),$(o).tooltip("show"),timeoutID.push(window.setTimeout(function(){$(o).tooltip("destroy"),clearTimeout(this),timeoutID=[]},timerMS))),$("#guest").attr("title","Required! - 'Add at least one guest'")};Vue.component("event-modal",{template:templateEvent,props:{show:{type:Boolean,required:!0,twoWay:!0}},methods:{keyUp:function(){getTags=$("#tagList").tagging("getTags");for(var e=0;e<getTags.length;e++)getTags[e]=getTags[e].trim();strTags=getTags.join(", ").replace(/\s\s+/g," "),$("#guestHidden").val(strTags)},addEvent:function e(){var e=!1;$(".event-required").each(function(){return getTags=$("#tagList").tagging("getTags"),$("#guestHidden").val(getTags),""===$(this).val()?(e=!1,$(this).focus(),eventValidation(this),!1):(e=!0,!0)}),e&&(this.event.guest=strTags,"undefined"!=typeof this.event.description&&(this.event.description=String('"'+this.event.description+'"')),this.event.date2=document.getElementById("date2").value,this.$dispatch("event-data",this.event),this.event={name:"",date1:datetime+"  @  11:30 AM",date2:datetime+"  @  4:30 PM",eventType:""},$("#tagList").tagging("removeAll"),numEvents||this.$parent.addBox(),numEvents+=one)}}}),Vue.component("login-modal",{template:templateLogin,props:{show:{type:Boolean,required:!0,twoWay:!0}},methods:{login:function(e){$(".help-block").remove();var t,n;e||(t=this.userLogin.email.toLowerCase(),n=this.userLogin.password);for(var a=0;a<accountUsers.length;a++)if(!(accountUsers[a].email!==t&&accountUsers[a].email!==e[zero]||accountUsers[a].password!==n&&accountUsers[a].password!==e[one]))return userLogged=[accountUsers[a].email,!0,accountUsers[a].fname,a,accountUsers[a].password],localStorage.setObject("logged",userLogged),storedEvents=accountUsers[a].events,this.$parent.eventLists=storedEvents,numEvents=storedEvents.length,numEvents>=one&&this.$parent.addBox(),loggedIn=!0,this.$parent.navLogName=userLogged[two]+" - Sign out",$(".alter").empty(),$(".clearInput").each(function(){$(this).val("")}),$("#remove-class").removeClass("custom-li"),this.$parent.hideModals(),$(".mid-section").prepend(strAlert+strLogIn),this.$parent.alertRemove(),$(".help-block-2").remove(),notValid=!1,!0;return t&&n&&!notValid&&(notValid=!0,$("#validForm").prepend("<span class='help-block-2'>Email or password does not match.</span>")),!1},create:function(){if($(".help-block").remove(),createBoolean){for(var e,t=this.register.email.toLowerCase(),n=this.register.fname.capitalize(),a=this.register.lname.capitalize(),i=0;i<accountUsers.length;i++)if(t===accountUsers[i].email)return notValid||(notValid=!0,$("#validForm2").prepend("<span class='help-block-2'>Email account already exists</span>")),!1;this.register.organization!==!0&&(e="");var o={fname:n,lname:a,email:t,password:this.register.password,organization:e,events:[]};accountUsers.push(o),localStorage.setObject("user",accountUsers),$(".mid-section").prepend(strAlert+strReg),this.$parent.alertRemove(),$(".clearInput").each(function(){$(this).val("")}),this.$parent.hideModals(),$(".help-block-2").remove(),$(".form-control-feedback").removeClass("glyphicon-ok"),createBoolean=!1}return!0}}});var initVue=new Vue({el:"#app",data:{showEvent:!1,showLogin:!1,eventLists:[],navLogName:"",signUp:"Sign Up",logIn:"Log In"},events:{"event-data":function(e){this.eventLists.push(e),accountUsers[userLogged[three]].events=this.eventLists,localStorage.setObject("user",accountUsers),this.showEvent=!1}},methods:{showModalEvent:function(){loggedIn?(this.showEvent=!0,setTimeout(function(){$("#event-name").focus()},one)):(this.showLogin=!0,$("#login-form").fadeIn(fadeTime),$("#register-form").hide())},showModalLogin:function(){this.showLogin=!0,$("#login-form").fadeIn(fadeTime),$("#register-form").hide(),setTimeout(function(){$("#login-name").focus()},one)},showModalSignUp:function(){this.showLogin=!0,$("#register-form").fadeIn(fadeTime),$("#login-form").hide(),setTimeout(function(){$("#fname").focus()},one)},hideModals:function(){this.showLogin=!1,$("#register-form").hide(),$("#login-form").hide()},deleteEvent:function(e){this.eventLists.splice(e,one),accountUsers[userLogged[three]].events=this.eventLists,localStorage.setObject("user",accountUsers),numEvents-=one,numEvents||($(".change").toggleClass("invisible add-box"),$(".removeEvent").remove())},signOut:function(){$("#signUp").append("<a href='#'>Sign Up</a>"),$("#logIn").append("<a href='#'>Log In</a>"),$(".mid-section").prepend(strAlert+strLogOut),this.alertRemove(),$("#remove-class").addClass("custom-li"),this.navLogName="",loggedIn=!1,userLogged[one]=!1,localStorage.setObject("logged",userLogged),this.eventLists=[],numEvents&&($(".change").toggleClass("invisible add-box"),$(".removeEvent").remove()),numEvents=0},alertRemove:function(){$(".alert").delay(timerDelay).fadeOut(fadeTime)},addBox:function(){$(".navEvent").append("<a href='#' class='removeEvent'>Add Event</a>"),$(".change").toggleClass("add-box invisible")}},ready:function(){if($("#tagList").tagging(),$(".form_datetime").datetimepicker({format:"yyyy-mm-dd  @  H:ii P",weekStart:1,todayBtn:1,autoclose:1,todayHighlight:1,startView:2,forceParse:0,showMeridian:1}),$(".form_datetime").datetimepicker("setStartDate",datetime),null!==localStorage.getObject("user")&&(accountUsers=localStorage.getObject("user")),currentUser=localStorage.getObject("logged"),null!==currentUser&&currentUser[one]){loggedIn=!0,this.navLogName=currentUser[two]+" - Sign out",$(".alter").empty();var e=[currentUser[zero],currentUser[four]];this.$children[one].login(e)}}}),validateRules={rules:{fname:{noSpaceStart:!0,minlength:3,maxlength:15,required:!0,noSpaceEnd:!0},lname:{noSpaceStart:!0,minlength:3,maxlength:15,required:!0,noSpaceEnd:!0},password:{noSpaceStart:!0,oneDigit:!0,oneLowercase:!0,oneUppercase:!0,minlength:7,maxlength:20,required:!0,noSpaceEnd:!0}},highlight:function(e){idAttr="#"+$(e).attr("id")+"1",$(e).closest(".form-group").removeClass("has-success").addClass("has-error"),$(idAttr).removeClass("glyphicon-ok").addClass("glyphicon-remove")},unhighlight:function(e){idAttr="#"+$(e).attr("id")+"1",$(e).closest(".form-group").removeClass("has-error").addClass("has-success"),$(idAttr).removeClass("glyphicon-remove").addClass("glyphicon-ok")},errorElement:"span",errorClass:"help-block",errorPlacement:function(e,t){$(".help-block").remove();var n;t.length&&(e.insertAfter(t),n=$("#passwordLog").val()),""===n&&(notValid=!1,$(".help-block-2").remove())},submitHandler:function(){createBoolean=!0,this.errorContext[zero].length!==four&&initVue.$children[one].create()}};$("input").focusout(function(){eventValidation(this)}),$(".emailValid").each(function(){$(this).focusout(function(){""!==$(this).val()?$(this).siblings("label").css("transform","translate(-12%, -40%) scale(0.75)"):""===$(this).val()&&$(this).siblings("label").css("transform","")})}),$("#regForm").submit(function(e){e.preventDefault()}).validate(validateRules),$("#logForm").submit(function(e){e.preventDefault()}).validate(validateRules);