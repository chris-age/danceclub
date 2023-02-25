How to use layout "event-v2.html"
=================================


HTTP Request Parameters for various Pages
-----------------------------------------

### ?lang=<2-letter language code>
Overwrite the (UI) language provided by the browser.
If language not "en" or "de" then for css class="lang-show-one-or-all" text of both languages (en and cursive de) is displayed.
Example(s):
    https://dance123.club/...?lang=en
    https://dance123.club/...?lang=de
    https://dance123.club/...?lang=xx

### ?is-browser-supported=<0 or 1> - for testing only
Overwrite the automatic detection whether the browser support all used (JavaScript) technology.
Example(s):
Example(s):
    https://dance123.club/...?is-browser-supported=0
    https://dance123.club/...?is-browser-supported=1



HTTP Request Parameters for Events
----------------------------------

### ?autostart=<seconds until registration dialog opens automatically>
If autostart parameter is provided then the registration dialog opens automatically.
Useful for links from pages that already describe the event, e.g. on eventbrite or similar sites.

Example - open the registration or join dialog after 3 seconds:
    https://dance123.club/...?autostart=3


### ?optcode=<one of the values of page.registration_email_is_optional_with_optcodes>
If the optcode here matches to one of the codes configured in page.event_registration_email_is_optional_with_optcodes for the event, then the email is optional for user registration.

Example(s):
    https://dance123.club/...?optcode=djchris-friendcode1


### ?testviews=<one of the timing related views; can be also a comman separated list of some views in the future>
If the optcode here matches to one of the codes configured in page.event_registration_email_is_optional_with_optcodes for the event, then the email is optional for user registration.

Example(s):
    https://dance123.club/...?testviews=event-infuture-view
    https://dance123.club/...?testviews=event-now-view
    https://dance123.club/...?testviews=event-over-view



### ?views=<comma separated list of view aspects> (ONLY IF ENABLED
Show (only) the listed view aspects (overwrites JavaScript logic). Usefull for testing only.

Possible elements:
* event-infuture-view, event-now-view, event-over-view
* event-supported-browser-view,event-unsupported-browser-view,
* event-registereduser-view,event-anonymoususer-view,
* event-registration-view, event-noregistration-view,
* event-registration-email-required-view,event-registration-email-notrequired-view,
* event-registration-code-required-view,event-registration-code-notrequired-view,
* event-registration-name-required-view,event-registration-name-notrequired-view,
* event-registration-gender-required-view,event-registration-gender-notrequired-view,
* event-registration-comment-required-view,event-registration-comment-notrequired-view");
* ...

Example(s):
    https://dance123.club/...?views=event-supported-browser-view,event-registereduser-view,event-registration-view,event-now-view



Page Parameters - to configure the Event
----------------------------------------

### page.permalink (madatory - default: page.url)
event_path of the event
Example(s):
    permalink: /events/video-dance-afterwork-zoom-party-2021-07-13

### page.meta_refresh_content (default: undefined)
Value for HTTP redirect to a new URL.
Example(s):
    meta_refresh_content: "0; https://dance123.club/#events"



### page.event_title (mandatory)
Title of the event
Example(s):
    event_title: The 80s Party

### page.event_subtitle (default: layout.default_event_subtitle)
Sub title of the event
Example(s):
    event_subtitle: The best hits for the 1980s ...

### page.event_description (default: event_subtitle or layout.default_event_description)
Description. For SEO and calendar entries.
Example(s):
    event_description: "Zoom Video Dance Party - live from Berlin"

### page.event_keywords (default: <empty>)
Keywords for SEO. In addition to layout.additional_event_keywords.
Example(s):
    event_keywords: "Zoom Video Dance Party, 80s party, 90s party, 1980, 1990"

### page.event_lang_main (default: layout.default_event_lang_main)
Main language of the event. The title, subtitle, descrption ... should be in this language.
Only allowed values: "en" or "de".
Example(s):
     event_lang_main: en
     event_lang_main: de

### page.event_image_path (default: layout.default_event_image_path)
Image path.
Example(s):
    event_image_path: /assets/images/event-80s-party-popart_1600x800.jpg



### page.event_performer_name (default: layout.default_event_performer_name)
Name of the DJ or artist. For SEO and calendar entries.
Example(s):
    event_performer_name: DJ Berlin123

### page.event_organizer_name (default: layout.default_event_organizer_name)
Name of the event organizer. For SEO and calendar entries.

### page.event_organizer_url (default: default_event_organizer_url)
URL of the event organizer. For SEO and calendar entries.

### page.site_name (default: layout.default_site_name)
Site name for SEO.



### page.event_time_begin_utc (mandatory)
UTC start date/time of the event.
Example(s):
    event_time_begin_utc: "2021-07-03T09:00Z"

### page.event_time_duration_hours_mins (mandatory)
Duration of the event in hours:minutes in format 00:00.
Min value: 00:01
Max value: 23:59
Example for 3 hour and 30 mins duration:
    event_time_duration_hours_mins: "03:30"

### page.event_starts_earlier_seconds (default: layout.default_event_starts_earlier_seconds)
Give access to the rooms a bit before the official start of the event. In seconds as JavaScript expression.
Example(s):
    event_starts_earlier_seconds:   "1*60"

### page.event_ends_later_seconds_anonymous_user and page.event_ends_later_seconds_registered_user (default: layout.default_event_ends_later_seconds_anonymous_user, layout.default_event_ends_later_seconds_registered_user)
Give access to the rooms a after the official end of the event. In seconds as JavaScript expression.
Example(s):
    event_ends_later_seconds_anonymous_user:   "0*60"
    event_ends_later_seconds_registered_user: "15*60"



### page.is_event_registration_disabled (default: false)
Is the registration/joining to this event (currently) impossible? Boolean value.
Set to true to disable registration.
Example(s):
    is_event_registration_disabled: true

### page.event_registration_email_is_optional_with_optcodes (default: empty)
Providing an email can be optional when the event page is called with HTTP request parameter "optcode".
In such case the parameter value must match any of the configured (by comma separated list) values. 
Independent of page.event_required_registration_codes .

Example(s) to allow email-free gegistration with URL "https://dance123.club/...?optcode=djchris-friendcode1":
    event_registration_email_is_optional_with_optcodes: "djchris-friendcode1,testcode123"

### page.event_required_registration_codes (default: empty)
If set (comma separated list) then the user must enter on of these codes in the registration form.
It's a kind of invitation code.
Independent of page.event_registration_email_is_optional_with_optcodes .
Example(s):
    event_required_registration_codes: "invitation123,code456"

# page.is_event_registration_name_required (default: false)
Set to true if the registration form should ask for a user name.
Example(s):
    is_event_registration_name_required: true

### page.is_event_registration_gender_required (default: false)
Set to true if the registration form should ask for a user gender.
Example(s):
    is_event_registration_gender_required: true

### page.is_event_registration_comment_required (default: false)
Set to true if the registration form should ask for a user comment.
Example(s):
    is_event_registration_comment_required: true

### page.default_r (default: undefined)
Default value for HTTP parameter "r" for tracking. Used, if the page is called without "r" parameter.
Example(s):
    default_r: dj-chris123-ref



### page.event_video_meeting_url (default: site.video_meeting_url)
Zoom meeting URL.

### page.event_video_meeting_id (default: site.video_meeting_id)
Zoom meeting ID.

### page.event_video_meeting_pin (default: site.video_meeting_pin)
Zoom meeting PIN.

### page.event_web_trember_url (default: site.web_trember_url)
The trember.me URL.




### page.is_event_rooms_multiple_enabled (default: false)
Has the event multiple rooms? Boolean value.
Example(s):
    is_event_rooms_multiple_enabled: true
    
### page.is_rooms_all_enabled (default: false)
Show single rooms and all rooms? Boolean value. Should be true for testing only.
Example(s):
    is_event_rooms_all_enabled: true

### page.is_event_mainroom_disabled (default: false)
Directly go to a room URL as default when joining the party (in a new tab)? Boolean value.
If the user should be forced to expecitely select a room in a multi-room event then set it to true
Example(s):
    is_event_mainroom_disabled: true

### page.event_mainroom_url (default: layout.default_event_mainroom_url or event_video_meeting_url)
Directly go to this room URL as default when joining the party.
Example(s):
    event_mainroom_url: /rooms/room-video-lounge-web-trember
    event_mainroom_url: "https://trember.me/joinvideo/RGB-76204-snch-224"



### page.event_in_list (default: false)
Set to true to have this event should be listed on "/#events" on the home page.
Example(s):
    event_in_list: true

### page.layout (mandatory)
Set the layout to render this event.
Set:
    layout: event-v2



General hints
-------------
Using layout.default_* values for booleans is not possible because false and undefined are the same for Jekyll/Liquid. I.e. setting a page value with false has no effect.


General Rules
-------------
* use underscores fro Jekyll/Liquid variables:     im_a_jekyll_variable
  * default values start/prefix with "default_":   default_jekyll_variable
* use dashes in CSS class names:                   im-a-css-class
* use camel case for JavaScript variables:         imAJavaScriptVariable




