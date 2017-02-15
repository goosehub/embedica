<h1>embedica</h1>

<p>Converts links into embed HTML for several sites.</p>

<h2>Usage</h2>

No external libraries required. Just include and use.

<code>
    // Defaults to convert all
    // Pass in a string as a parameter
    // Returns the string with URLs converted to the desired HTML
    string = embedica(string);
    
    // Specify which URLs to convert
    var embedica_settings = {
        "youtube": true,
        "vimeo": true,
        "twitch": true,
        "soundcloud": true,
        "vocaroo": true,
        "video_url": true,
        "image_url": true,
        "general_url": true
    };
    var string = embedica(string, embedica_settings);
</code>

<h2>Support</h2>

<ul>
    <li>Youtube (long url, share url, and mobile url formats, does not support start times or other options)</li>
    <li>Vimeo</li>
    <li>Twitch</li>
    <li>Soundcloud (with an api call)</li>
    <li>Vocaroo</li>
    <li>Video URLs (webm, mp4, ogv)</li>
    <li>Image URLs (jpg, gif, png)</li>
    <li>General URLs into hyperlinks (works best when begins with http/https and/or ends with /)</li>
    <li>Will match multiple on a single string input</li>
</ul>

<h2>Currently used by</h2>

<a href="http://smallcrowd.us/">http://smallcrowd.us/</a>

<p>Public contributions large and small welcome and encouraged!</p>
