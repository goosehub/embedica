# embedica

Converts links into embed HTML for several sites.

## Usage

No external libraries required. Just include and use. Pass in a string as a parameter. Returns the string with URLs converted to the desired HTML. Each embedded element is wrapped in a `span` with the class `embedica_element` and a class coresponding to it's type (Example: `embedica_youtube`) to help you target with CSS and JavaScript as needed.

```
    /* Default to convert all */
    string = embedica(string);
    
    /* Specify which URLs to convert */
    var embedica_settings = {
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
    var string = embedica(string, embedica_settings);
```

Inside of `.embedica_element` is a hidden `span` with the class `embedica_original_input` that contains the original message.

## Support

* Youtube (long url, share url, and mobile url formats, does not support start times or other options)
* Vimeo
* Twitch
* Soundcloud (with an api call)
* Vocaroo
* Imgur
* Video URLs (webm, mp4, ogv) as a video tag
* Image URLs (jpg, gif, png) as an img tag
* General URLs as hyperlinks (works best when begins with http/https and/or ends with /)
* URL can be in the middle of long string of text, output will preserve the rest of the text
* Will match multiple URLs on a single input

## Currently used by

[https://smallcrowd.us/](https://smallcrowd.us/)

[https://banhammer.site/](https://banhammer.site/)

[https://bigworld.io/](https://bigworld.io/)

### Public contributions large and small welcome and encouraged!
