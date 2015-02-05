/**
 * A class function representing a media plug-in.
 * @param framework The NeoJS framework reference.
 */
function $_media(framework) {

    "use strict";

    /**
     * A reference to itself.
     * @type {$_media}
     */
    var self = this;

    /**
     * The user media reference.
     * @type {*}
     */
    var media = framework.userMedia();

    /**
     * Create a new media type to access.
     * @param width The width.
     * @param height The height.
     * @param _arguments {*=} The constraint arguments.
     * @param _function {*=} The callback function.
     * @param error {*=} The response error function.
     */
    this.create = function(width, height, _arguments, _function, error) {

        if(!framework.isDefined(media)) {
            throw "There was no user media stream found";
        }

        var video = framework.create("video");
        var instance = new webcam(video);

        video.attribute("width", width);
        video.attribute("height", height);
        video.attribute("autoplay", "true");

        if(_arguments['controls'] == true) {
            video.attribute("controls", "true");
        }

        if(_arguments['video'] && _arguments['hd'] == true) {
            _arguments['video'] = {
                mandatory: {
                    minWidth: 1280,
                    minHeight: 720
                }
            };
        }

        navigator[media](_arguments, function(stream) {

            video.attribute("src", window.URL.createObjectURL(stream));

            if(framework.isDefined(_function)) {
                _function(instance);
            }

        }, function(response) {

            if(framework.isDefined(error)) {
                error(response);
            }

        });

    };

    /**
     * A class function representing a web cam instance.
     * @param _video The video node.
     */
    var webcam = function(_video) {

        /**
         * Get the video node.
         * @returns {*}
         */
        this.video = function() {
            return _video;
        };

        /**
         * Capture a shot from the web cam.
         * @returns {shot}
         */
        this.capture = function() {

            var instance = new shot();

            return instance;

        };

        /**
         * A class function representing a captured shot from the web cam.
         */
        var shot = function() {

            this.upload = function(url, name) {

            };

        };

    };

};