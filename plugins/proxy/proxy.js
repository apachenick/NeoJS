/**
 * A class function representing a proxy plug-in.
 * @param framework The NeoJS framework reference.
 */
function $_proxy(framework) {

    "use strict";

    /**
     * Make an AJAX call to a link using a proxy.
     * @param link The given link.
     * @param _function The callback function.
     * @param headers{*=}  If the headers should be included.
     * @param status {*=} The if the status should be included.
     */
    this.call = function(link, _function, headers, status) {

        if(!framework.isDefined(framework.arguments()['plugin_folder'])) {
            framework.arguments()['plugin_folder'] = "plugins";
        }

        framework.ajax().call(framework.arguments()['plugin_folder']+"/proxy/proxy.php?url="+encodeURIComponent(link)+"&full_headers="+(headers ? "1" : "0")+"&full_status="+(status ? "1" : "0"), function(request, data) {
            _function(data);
        }, "GET");

    };

}