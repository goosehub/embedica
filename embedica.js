// Main function
function embedica(message, settings) {
  // Default to use all
  var default_settings = {
    "youtube": true,
    "vimeo": true,
    "twitch": true,
    "soundcloud": true,
    "vocaroo": true,
    "imgur": true,
    "video_url": true,
    "image_url": true,
    "general_url": true
  };

  // Space around break tags
  var re = new RegExp('<br>', 'g');
  message = message.replace(re, ' <br> ');

  // Merge passed settings with defaults
  settings = Object.assign(default_settings, settings);
  // Order important in some cases to avoid conflicts
  if (settings.youtube) {
    message = embedica_convert_youtube(message);
  }
  if (settings.vimeo) {
    message = embedica_convert_vimeo(message);
  }
  if (settings.twitch) {
    message = embedica_convert_twitch(message);
  }
  if (settings.soundcloud) {
    message = embedica_convert_soundcloud(message);
  }
  if (settings.vocaroo) {
    message = embedica_convert_vocaroo(message);
  }
  if (settings.imgur) {
    message = embedica_convert_imgur(message);
  }
  if (settings.video_url) {
    message = embedica_convert_video(message);
  }
  if (settings.image_url) {
    message = embedica_convert_image(message);
  }
  if (settings.general_url) {
    message = embedica_convert_link(message);
  }
  return message;
}

function embedica_convert_youtube(input) {
  var pattern = /(?:http?s?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?!channel\/)(?!user\/)(?:watch\?v=)?([a-zA-Z0-9_-]{11})(?:\S+)?/g;
  if (pattern.test(input)) {
    var replacement = '<span class="embedica_youtube embedica_element"><iframe src="//www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe></span>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}

function embedica_convert_vimeo(input) {
  var pattern = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(\S+)/g;
  if (pattern.test(input)) {
    var replacement = '<span class="embedica_vimeo embedica_element"><iframe src="//player.vimeo.com/video/$1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></span>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}

function embedica_convert_twitch(input) {
  var pattern = /(?:http?s?:\/\/)?(?:www\.)?(?:twitch\.tv)\/?(\S+)/g;
  if (pattern.test(input)) {
    var replacement = '<span class="embedica_twitch embedica_element"><iframe src="https://player.twitch.tv/?channel=$1&!autoplay" frameborder="0" allowfullscreen="true" scrolling="no"></iframe></span>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}

function embedica_convert_vocaroo(input) {
  var pattern = /(?:http?s?:\/\/)?(?:www\.)?(?:vocaroo\.com\/i)\/?(\S+)/g;
  if (pattern.test(input)) {
    var replacement = '<span class="embedica_vocaroo embedica_element"><object><param name="movie" value="http://vocaroo.com/player.swf?playMediaID=$1&autoplay=0"></param><param name="wmode" value="transparent"></param><embed src="http://vocaroo.com/player.swf?playMediaID=$1&autoplay=0" wmode="transparent" type="application/x-shockwave-flash"></embed></object></span>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}

function embedica_convert_imgur(input) {
  var pattern = /(?:http?s?:\/\/)?(?:www\.)?(?:(?:m.)imgur\.com)\/a\/?(\S+)/g;
  if (pattern.test(input)) {
    var replacement = '<span class="embedica_imgur embedica_element"><blockquote class="imgur-embed-pub" lang="en" data-id="a/$1"><a href="//imgur.com/$1"></a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script></span>';
    var input = input.replace(pattern, replacement);
    console.log(input);
  }
  return input;
}

function embedica_convert_video(input) {
  var pattern = /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?(?:webm|mp4|ogv))/gi;
  if (pattern.test(input)) {
    var replacement = '<span class="embedica_video embedica_element"><video controls="" loop="" controls src="$1"></video></span>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}

function embedica_convert_image(input) {
  // Ignore " to not conflict with other converts
  var pattern = /(?!.*")([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?(?:jpg|jpeg|gif|png)(?:\?\S+)?)/gi;
  if (pattern.test(input)) {
    var replacement = '<span class="embedica_image embedica_element"><a href="$1" target="_blank"><img class="embedica_image embedica_element" src="$1"/></a></span>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}

function embedica_convert_link(input) {
  // Ignore " to not conflict with other converts
  var pattern = /(?!.*")([-a-zA-Z0-9@:%_\+.~#?&//=;]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=;]*))/gi;
  if (pattern.test(input)) {
    var replacement = '<span class="embedica_link embedica_element"><a href="$1" target="_blank">$1</a></span>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}

// Soundcloud requires an api call
// We use a placeholder span with id, and will target and fill that span on success
function embedica_convert_soundcloud(input) {
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
    var replacement = '<span id="' + soundcloud_id + '" class="embedica_soundcloud embedica_element"></span>';
    var input = input.replace(pattern, replacement);
  }
  return input;
}