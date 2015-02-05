/**
 * A class function representing a Skype plug-in.
 * @param framework The NeoJS framework reference.
 */
function $_skype(framework) {

    "use strict";

    /**
     * A reference to itself.
     * @type {$_skype}
     */
    var self = this;

    /**
     * The protocol prefix.
     * @type {string}
     */
    var protocol = "skype:";

    /**
     * Get the status for a given Skype account name.
     * @param name The account name.
     * @param _function The response callback function.
     * @returns {$_skype}
     */
    this.status = function(name, _function) {

        framework.plugin("proxy", function(plugin) {

            plugin.call("http://mystatus.skype.com/"+name+".xml", function(data) {

                var parser = new DOMParser();
                var contents = parser.parseFromString(JSON.parse(data)['contents'], "text/xml");
                var response = [];

                framework.select("presence", "tag", contents).each(function(node) {
                    response[node.attribute("xml:lang").toLowerCase()] = framework.isNumber(node.inner()) ? parseInt(node.inner()) : node.inner();
                });

                _function(response);

            });

        });

        return self;

    };

    /**
     * Open a chat conversation one or more participants.
     * @param names The participant name(s).
     * @returns {*}
     */
    this.chat = function(names, _arguments) {

        var action = "chat";

        if(framework.isDefined(_arguments)) {

            if(_arguments['topic'].length > 0) {
                action += "&topic="+self.trim(_arguments['topic']);
            }

        }

        return this.action(names, action);
    };

    /**
     * Call with one or more participants.
     * @param names The participant name(s).
     * @returns {*}
     */
    this.call = function(names, _arguments) {

        var action = "call";

        if(framework.isDefined(_arguments)) {

            if(_arguments['video']) {
                action += "&video="+_arguments['video'];
            }

            if(_arguments['topic'].length > 0) {
                action += "&topic="+self.trim(_arguments['topic']);
            }

        }

        return this.action(names, action);
    };

    /**
     * Join an existing group conversation.
     * @param blob The unique binary large object.
     * @returns {*}
     */
    this.join = function(blob) {
        return this.action("", "chat&blob="+blob);
    };

    /**
     * Execute an action using the Skype protocol.
     * @param names The participant names.
     * @param action The action.
     */
    this.action = function(names, action) {

        if(framework.isArray(names)) {

            var _names = "";

            names.forEach(function(name) {
                _names += name+(names.length > 1 ? ";" : "");
            });

            names = _names;

        }

        window.open(protocol+names+"?"+action, "_self");

    };

    /**
     * Check if the Skype is installed under the web plug-ins.
     * @returns {boolean}
     */
    this.hasSkype = function() {
        if(new ActiveXObject("Skype.Detection") && framework.isIE()) {
            return true;
        }
        return framework.hasMimeType("application/x-skype");
    };

    /**
     * Trim all the unwanted characters from the string.
     * @param string The string.
     * @returns {string}
     */
    this.trim = function(string) {
        if(!framework.isDefined(string) || framework.isNull(string)) {
            return "";
        }
        string = string.replace(/\s/g, "%20");
        string = string.replace(/:/g, "%3A");
        string = string.replace(/\x2F/g, "%2F");
        return string.replace(/\x5C/g, "%5C");
    };

}