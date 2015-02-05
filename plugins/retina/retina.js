/**
 * A class function representing retina image optimizer.
 * @param framework The NeoJS framework reference.
 */
function $_retina(framework, _arguments) {

    "use strict";

    /**
     * A reference to itself.
     * @type {$_retina}
     */
    var self = this;

    /**
     * Initialize the retina optimization.
     * @returns {$_retina}
     */
    this.initialize = function() {

        if(!framework.isDefined(_arguments['image_suffix'])) {
            _arguments['image_suffix'] = "@2x";
        }

        var images = framework.select("img:not([no-retina])", "query_all");

        if(images.size() > 0) {

            images = images.filter(function(node) {
                return !framework.format().endsWith(node.attribute("src").split(".")[0], "@2x");
            });

            images.each(function(image) {
                self.applyImage(image, false);
            });

        }

        if(_arguments['stylesheets']) {

            images = framework.select("background-image", "css_rule");

            if(images.size() > 0) {

                images = images.filter(function(node) {
                    return node.css("background-image").indexOf("url(") === 0 && !node.hasAttribute("no-retina") && node.css("background-size") == "auto";
                });

                images.each(function(image) {
                    self.applyImage(image, true);
                });

            }

        }

        return self;

    };

    /**
     * Apply the retina version of the image.
     * @param image The image element node.
     */
    this.applyImage = function(image, css) {

        if(!css) {

            var src = image.attribute("src");
            var width = image.width();
            var height = image.height();

            if(!framework.isExternal(src) || _arguments['ignore_external']) {
                self.validateImage(image, src, function(src) {
                    image.attribute("width", width);
                    image.attribute("height", height);
                    image.attribute("src", src);
                });
            }

        } else {

            var url = framework.format().stripURL(image.css("background-image"));

            if(!framework.isExternal(url) || _arguments['ignore_external']) {

                var original = new Image();
                original.src = url;

                self.validateImage(image, url, function(url) {
                    image.css("background-image", "url("+url+")");
                    image.css("background-size", original.width+"px "+original.height+"px");
                });

            }

        }

    };

    /**
     * Validate a given image for retina.
     * @param image The image element node.
     * @param src The image source.
     */
    this.validateImage = function(image, src, _function) {

        src = src.replace(/(\.[^\.]+)$/, _arguments['image_suffix']+"$1");

        try {
            framework.ajax().call(src, function(request) {
                if(request.status == 200) {
                    var content_type = request.getResponseHeader("Content-type");
                    if(content_type !== null && content_type.match(/^image/i)) {
                        _function(src);
                    }
                }
            }, false);
        } catch(e) {
            if(_arguments['debug']) {
                console.error("Retina image: " + src + " couldn't be found.");
            }
        }

    };

    if(framework.isRetina()) {

        if(!framework.isDefined(_arguments)) {
            _arguments = {
                image_suffix: "@2x",
                stylesheets: false,
                ignore_external: false,
                debug: false
            };
        }

        this.initialize();

    }

}