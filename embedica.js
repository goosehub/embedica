// Main function
function embedica(message, settings) {
  // Default to use all
  var default_settings = {
    "youtube": true,
    "vimeo": true,
    "twitch": true,
    "soundcloud": true,
    "vocaroo": true,
    "video_url": true,
    "image_url": true,
    "general_url": true
  };
  // Merge passed settings with defaults
  settings = Object.assign(default_settings, settings);
  // Order important in some cases to avoid conflicts
  if (settings.youtube) {
    message = convert_youtube(message);
  }
  if (settings.vimeo) {
    message = convert_vimeo(message);
  }
  if (settings.twitch) {
    message = convert_twitch(message);
  }
  if (settings.soundcloud) {
    message = convert_soundcloud(message);
  }
  if (settings.vocaroo) {
    message = convert_vocaroo(message);
  }
  if (settings.video_url) {
    message = convert_video_url(message);
  }
  if (settings.image_url) {
    message = convert_image_url(message);
  }
  if (settings.general_url) {
    message = convert_general_url(message);
  }
  return message;
}

function convert_youtube(input) {
  var pattern = /(?:http?s?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?!channel\/)(?!user\/)(?:watch\?v=)?([a-zA-Z0-9_-]{11})(?:\S+)?/g;
  if (pattern.test(input)) {
    var replacement = '<span class="message_youtube_parent"><iframe src="//www.youtube.com/embed/$1" frameborder="0" allowfullscreen class="message_youtube message_content"></iframe></span>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}

function convert_vimeo(input) {
  var pattern = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(\S+)/g;
  if (pattern.test(input)) {
    var replacement = '<iframe src="//player.vimeo.com/video/$1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen class="message_vimeo message_content"></iframe>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}

function convert_twitch(input) {
  var pattern = /(?:http?s?:\/\/)?(?:www\.)?(?:twitch\.tv)\/?(\S+)/g;
  if (pattern.test(input)) {
    var replacement = '<iframe src="https://player.twitch.tv/?channel=$1&!autoplay" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620" class="message_twitch message_content"></iframe>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}

function convert_vocaroo(input) {
  var pattern = /(?:http?s?:\/\/)?(?:www\.)?(?:vocaroo\.com\/i)\/?(\S+)/g;
  if (pattern.test(input)) {
    var replacement = '<object width="148" height="44" class="message_vocaroo message_content"><param name="movie" value="http://vocaroo.com/player.swf?playMediaID=$1&autoplay=0"></param><param name="wmode" value="transparent"></param><embed src="http://vocaroo.com/player.swf?playMediaID=$1&autoplay=0" width="148" height="44" wmode="transparent" type="application/x-shockwave-flash"></embed></object>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}

function convert_video_url(input) {
  var pattern = /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?(?:webm|mp4|ogv))/gi;
  if (pattern.test(input)) {
    var replacement = '<video controls="" loop="" controls src="$1" style="max-width: 960px; max-height: 676px;" class="message_video message_content"></video>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}

function convert_image_url(input) {
  // Ignore " to not conflict with other converts
  var pattern = /(?!.*")([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?(?:jpg|jpeg|gif|png)(?:\?\S+)?)/gi;
  if (pattern.test(input)) {
    var replacement = '<a href="$1" target="_blank" class="message_image_link message_content"><img class="message_image message_content" src="$1"/></a><br />';
    var input = input.replace(pattern, replacement);
  }
  return input;
}

function convert_general_url(input) {
  // Ignore " to not conflict with other converts
  var pattern = /(?!.*")([-a-zA-Z0-9@:%_\+.~#?&//=;]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=;]*))/gi;
  if (pattern.test(input)) {
    var replacement = '<a href="$1" target="_blank" class="message_link message_content">$1</a>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}

// Soundcloud requires an api call
// We use a placeholder span with id, and will target and fill that span on success
function convert_soundcloud(input) {
  var pattern = /(?:http?s?:\/\/)?(?:www\.)?(?:soundcloud\.com)(\/\S+\/)(\S+)/g;
  if (pattern.test(input)) {
    // Use temporary id to identify this
    var soundcloud_id = new Date().getUTCMilliseconds();

    // Send request for URL we need
    xhr = new XMLHttpRequest();
    var url = 'http://soundcloud.com/oembed';
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var data = JSON.stringify({
      "format": "json",
      "url": input
    });
    xhr.send(data);
    // Populate placeholder with embed
    xhr.onreadystatechange = function () { 
      if (xhr.readyState == 4 && xhr.status == 200) {
        var json = JSON.parse(xhr.responseText);
        document.getElementById(soundcloud_id).innerHTML = json.html;
      }
    }

    // Create placeholder with temporary id
    var replacement = '<span id="' + soundcloud_id + '" class="message_soundcloud message_content"></span>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}