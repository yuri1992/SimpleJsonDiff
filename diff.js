/*
    GET Parameters:
        showSuccess = True| Default False, Will Show Success Massages

    Comparing the new object aginst the old one,
    check by order
    obj[x].field === obj[x].field 

*/


(function($) {
    function progressBar() {
        w_c = jQuery("#progress_bar div").css('width');
        w_c = parseInt(w_c.replace('px',''))
        w_c += 15;
        jQuery("#progress_bar div").css({'width':w_c+'px'});
    }

    var terminate = setInterval(function() {
        progressBar() },1000);

var object_compare = function(output) {
    if (output === 'undefined')
        output = 'html'
    this.config = this._initalGETParams()
    this.categoryId = this.config.categoryId || 2;
    this.version = this.config.version || 'IPAD';
    this.obj_old = {}
    this.obj_new = {}
    this.fetch();
    this.output = 'html';
    this._warning_count = 0;
    this._critical_count = 0;
}

object_compare.prototype = {
    init : function() {
        try {
            this.compare(this.obj_old,this.obj_new)
        }
        catch(err) {
            this.addHtmlLog(jQuery('<div class="fatal_error">'+err+'</div>'))
        }
        this.addStatusLog();
    },
    fetch : function () {
        var self = this;
        $.getJSON('http://local.ynet.co.il:8000/iphone/ynet/'+self.categoryId+'?version='+self.version, function(data) {
            self.obj_new = data
            $.getJSON('http://local.ynet.co.il:8000/iphone/json/0,,'+self.categoryId+'-'+self.version+'-NC,00.js', function(data) {
                    clearTimeout(terminate)
                    jQuery("#progress_bar").remove()
                    self.obj_old = data;
                    self.init();
                });
        });
    },
    compare : function(obj1, obj2, pre) {
        if (typeof(pre) === 'undefined')
            pre = '';

        for (var i in obj1) {
            pre_ = [pre,i].join('.')
            if (typeof(obj2[i]) === 'undefined') {
                this._criticalPrint(pre_+' Dosent Exists On New Object')
                continue;
            }
            if (typeof(obj1[i]) === 'object') {
                this._loging(pre_)
                this.compare(obj1[i],obj2[i],pre_)
            } else {
                if (!this.equalType(obj1[i],obj2[i]) ||
                    !this.equalValue(obj1[i],obj2[i])) {
                    this._printError(pre_+ ' Dosent Equal: old: '+obj1[i]+' new: '+obj2[i])
                } else {
                    console.log(this.config)
                    if (typeof(this.config.showSuccess) !== 'undefined' && this.config.showSuccess === "true")
                        this._succesful('key: '+pre_+' Equal')
                }
           }
        }
    },
    equalType : function(val,val2) {
        if (typeof(val) !== typeof(val2))
            return false;
        return true;
    },
    equalValue : function(val,val2) {
        if (val != val2)
            return false;
        return true;
    },
    addStatusLog : function() {
        this.addHtmlLog(jQuery('<div id="log_panel">'
                                +'<li>Critical Errors:</li>'+this._critical_count
                                +'<li>Warning Errors:</li>'+this._warning_count
                                +'</div>'));
    },
    _loging :function(msg) {
        if (this.output == 'log')
            console.log('comparing object key:'+msg)
        else {
            var log = document.createElement('div')
            log.classList.add('loging')
            
            log.innerHTML = msg
            this.addHtmlLog(log)
        }
    },
    _printError : function(msg) {
        this._warning_count++;
        if (this.output == 'log')
            console.log(msg)
        else {
            var log = jQuery('<div class="alert alert-warning" role="alert">'+
                              '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>'+
                              '<span class="sr-only">Error:</span> '+msg+'</div>');
            this.addHtmlLog(log)
        }
    },
    _succesful : function(msg) {
        if (this.output == 'log') {
            console.log('--------------')
            console.log(msg)
            console.log('--------------')
        } else {
            var log = jQuery('<div class="alert alert-success" role="alert">'+
                              '<span class="glyphicon glyphicon-flag" aria-hidden="true"></span>'+
                              '<span class="sr-only">Error:</span> '+msg+'</div>');
            this.addHtmlLog(log)
        }
    },
    _criticalPrint :function(msg) {
        this._critical_count++;
        if (this.output == 'log') {
            console.log('--------------')
            console.log(msg)
            console.log('--------------')
        } else {
            var log = jQuery('<div class="alert alert-danger" role="alert">'+
                              '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'+
                              '<span class="sr-only">Error:</span> '+msg+'</div>');
            this.addHtmlLog(log)
        }
    },
    addHtmlLog : function(el) {
       jQuery('#main').append(el)
    },
    _initalGETParams :function() {
        var params = window.location.search;
        var obj = {};
        params = params.replace('?','');
        pairs = params.split('&');
        for (var i =0;i<pairs.length; i++) {
            pair = pairs[i].split('=');
            obj[pair[0]]=pair[1];
        }
        return obj; 
    }
};
    
(new object_compare());

})(jQuery);

