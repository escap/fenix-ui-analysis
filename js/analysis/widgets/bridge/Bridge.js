define([
    'jquery'
    //'text!fx-ana/json/request.json'
], function ($) {

    var defaultOptions = {
            url: 'http://faostat3.fao.org/d3s2/v2/msd/resources/',
            method: 'GET'
        };

    function Bridge(opts) {

        this.o = {};

        $.extend(true, this.o, defaultOptions, opts);
    }

    Bridge.prototype.getMetadata = function () {

        if (this.o.resource.version) {
            $.ajax({
                type: this.o.method,
                url: this.o.url + this.o.resource.uid +'/'+ this.o.resource.version,
                context : this,
                contentType: 'application/json',
                data: {dsd:true, full:true},
                success: this.o.success,
                error : function () {
                    alert("IPI-side Problems")
                }
            });
        } else {
            $.ajax({
                type: this.o.method,
                url: this.o.url + 'uid/' + this.o.resource.uid ,
                context : this,
                contentType: 'application/json',
                data: {dsd:true, full:true},
                success: this.o.success,
                error : function () {
                    alert("IPI-side Problems")
                }
            });
        }
    };

    Bridge.prototype.query = function (settings) {

        $.extend(true, this.o, settings);

        //this.createBodyRequest();
        this.getMetadata();
    };

   /* Bridge.prototype.createBodyRequest = function () {

        var r = JSON.parse(request);
        r.filter.metadata.uid.push({"enumeration": this.o.uid});

        this.o.body = JSON.stringify(r);
    };*/

    return Bridge;
});
