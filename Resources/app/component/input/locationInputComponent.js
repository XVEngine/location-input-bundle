(function(namespace, app, globals) {

    namespace.locationInputComponent = app.newClass({
        extend: function () {
            return app.components.form.abstractInputComponent;
        }
    });

    namespace.locationInputComponent.prototype.getTemplate = function() {
        var tmplString = app.utils.getString(function() {
            //@formatter:off
            /**<string>
                <xv-location-input class="event-insert">
                   <label>
                       <span class="label fcolor-after"></span>
                       <div class="input">
            
                            <div class="adder">
                                <span contenteditable="true"></span>
                            </div>
                       </div>
                   </label>
                   <div class="autocomplete"></div>
                </xv-location-input>
             </string>*/
            //@formatter:on
        });
        return $(tmplString);
    };
    
    
    namespace.locationInputComponent.prototype.getLocationTemplate = function() {
        var tmplString = app.utils.getString(function() {
            /**<string>
                <div class="tag">
                   <span class="tag-label"></span>
                   <a href="#" style="display:none;" class="close">×</a>
                </div>
             </string>*/
        });
        return $(tmplString);
    };


    namespace.locationInputComponent.prototype.validators = {};


    namespace.locationInputComponent.prototype.getDefaultParams = function() {
        return {
            autoPrepend : "",
            placeholder : "",
            value : [],
            blockedTags: [],
            delimeters : [
                44 , 
                $.ui.keyCode.ENTER
            ],
            maxLengthTag : 100,
            minLengthTag : 3,
            maxTags : 1,
            onlyFromAutoComplete : true,
            focusNextSelector : null
        };
    };
    
    
    namespace.locationInputComponent.prototype.prepare = function() {
        this._validatorFunc = null;
        this._cacheLocations = {};
        this.$adder = this.$element.find(".adder");
        this.$adderEditable = this.$adder.find("> span");
        this.$autocomplete = this.$element.find("> .autocomplete");
        this.setAutoPrepend(this.params.autoPrepend);
        this.setDelimeters(this.params.delimeters);
        
        this.setMaxLengthTag(this.params.maxLengthTag);
        this.setMinLengthTag(this.params.minLengthTag);
        
        this.setMaxTags(this.params.maxTags);
        
        this.setPlaceholder(this.params.placeholder);
        this.setOnlyFromAutocomplete(this.params.onlyFromAutoComplete);
        


        this.setBlockedTags(this.params.blockedTags);
        //this.setValue(this.params.value);

        this.initEvents();
    };
    
    
    namespace.locationInputComponent.prototype.setValidatorFunc = function(val) {
        this._validatorFunc = val;
        return this;
    };


    namespace.locationInputComponent.prototype.setOnlyFromAutocomplete = function(val) {
        this._onlyFromAutocomplete = !!val;

        return this;
    };

    

    namespace.locationInputComponent.prototype.setAutoPrepend = function(value) {
        this._autoPrepend = value;
        return this;
    };
    
    namespace.locationInputComponent.prototype.setPlaceholder = function(value) {
        this.$adderEditable.attr("placeholder", value);
        return this;
    };
    
    namespace.locationInputComponent.prototype.setMaxLengthTag = function(value) {
        this._maxLengthTag = value|0;
        return this;
    };
    
    namespace.locationInputComponent.prototype.setMinLengthTag = function(value) {
        this._minLengthTag = value|0;
        return this;
    };
    
    namespace.locationInputComponent.prototype.setMaxTags = function(value) {
        this._maxTags = value|0;
        return this;
    };
    
    
    
    
    namespace.locationInputComponent.prototype.setDelimeters = function(value) {
        this._delimeters = value||[];
        return this;
    };
    
    
    
    namespace.locationInputComponent.prototype._filter = function(str) {
        if(str === " "){
            return str;
        }
        //str = str.replace(/[^a-zA-Z0-9\-_]+|\s+/gmi, "");
        return str;
    };
    
    
    
    namespace.locationInputComponent.prototype.initEvents = function (value) {
        var self = this;
        
        this.$adderEditable.on("paste", function () {
            return false;
        });
        
        
        this.$input.on("click" , ".tag > a", function(){
            $(this).parent().remove();
            self.onInput();
            self._refreshState();
            self.$adderEditable.focus();
            return false;
        });

        
        this.$adderEditable.on("input", function (e) {
            self.getAutoComplete();
        });

        this.$adderEditable.on("focusout", function (e) {
            setTimeout(function(){
                self._tryAddTag();
                self.cancelRequest();
                self.setAutocomplete([]);
            }, 100);
        });

        
        this.$adderEditable.on("keypress", function (e) {
            var charCode = !e.charCode ? e.which : e.charCode;
            
            if(charCode == $.ui.keyCode.BACKSPACE){
                return true;
            }
            
            var str = String.fromCharCode(charCode);
            var filtered = self._filter(str);

            var value = $(this).text().trim();
            var length = value.length;
            

            if (self._delimeters.indexOf(charCode) !== -1) {
                self._tryAddTag();

                return false;
            }

            if (length > (self._maxLengthTag || 999999)) {
                return false;
            }


            return filtered === str;
        });
        
        
        this.$adderEditable.on("keydown", function(e){
            var charCode = !e.charCode ? e.which : e.charCode;
            var allowedKeys = [
                $.ui.keyCode.LEFT,
                $.ui.keyCode.RIGHT
            ];

            var len = $(this).text().length;
           
            if(allowedKeys.indexOf(charCode) !== -1){
                return true;
            }
           
            if(charCode === $.ui.keyCode.TAB){
                self.focusNextElement(e);
                return true;
            }
            
            
            if(charCode == $.ui.keyCode.UP){
                self.upArrow();
                return false;
            }
            
            if(charCode ==  $.ui.keyCode.DOWN){
                self.downArrow();
                return false;
            }
            
            if(!(charCode == $.ui.keyCode.BACKSPACE && len === 0)){
                return true;
            }
            
            if(self.$adder.prev('.tag').find('.close').is(':visible')) {
                self.$adder.prev('.tag').remove();
            }
            self.onInput();
            self._refreshState();
            return true;
        });
        
        this.$input.on("click", function(){
            self.$adderEditable.focus();
        });
        
        
        this.$autocomplete.on("click" , "> div.item ", function(){
            self.addTag({id: $(this).find('> .tag-label').attr('value'), label: $(this).find('> .tag-label').text()});
            self.clearInput();
            self.$adderEditable.focus();
            self.onInput();
            return false;
        });

        
        
        return this;
    };
    
    

    
    
    namespace.locationInputComponent.prototype._getSelectedTag = function() {
        return this.$autocomplete.find("> div.item.selected");
    };
    
    namespace.locationInputComponent.prototype.upArrow = function() {
        var $prev = this.$autocomplete.find("> div.item.selected").prev();
        if(!$prev.length){
            $prev = this.$autocomplete.find("> div.item:last");
        }
        
        if(!$prev.length){
            return false;
        }
        
        this.$autocomplete.find(".item.selected").removeClass("selected");
        $prev.addClass("selected");
        
        
        var label = $prev.find(".tag-label").text();
        if(label){
            this.setInputValue(label);
        }
        this.placeCaretAtEnd();
        
        return true;
    };
    
    
    namespace.locationInputComponent.prototype.downArrow = function() {
        var $next = this.$autocomplete.find("> div.item.selected").next();
        if(!$next.length){
            $next = this.$autocomplete.find("> div.item:first");
        }
        
        if(!$next.length){
            return false;
        }
        
        this.$autocomplete.find(".item.selected").removeClass("selected");
        $next.addClass("selected");
        
        var label = $next.find(".tag-label").text();
        if(label){
            this.setInputValue(label);
        }
        this.placeCaretAtEnd();
        
        return true;
    };
    
    
    namespace.locationInputComponent.prototype._tryAddTag = function() {
        if(this._onlyFromAutocomplete){
            var value = this.getAutocompleteValue();
            if(!value){
                return false;
            }
        }
        this.addTag(value);
        this.clearInput();
        this.onInput();
        return true;
    };
    
    
    namespace.locationInputComponent.prototype.clearInput = function() {
        this.$adderEditable.text("");
        this.setAutocomplete([]);
        return true;
    };
    
    namespace.locationInputComponent.prototype.setInputValue = function(value) {
        this.$adderEditable.text(value);
        return true;
    };
    
    namespace.locationInputComponent.prototype.getFirstAutocomplete = function() {
        var $item = this.$autocomplete.find(".item:first > .tag-label");
        if(!$item.attr('value')) {
            return false;
        }
        return { id: $item.attr('value'), label: $item.text() };
    };


    namespace.locationInputComponent.prototype.getAutocompleteValue = function() {
        var $item =  this.$autocomplete.find(".item.selected:first > .tag-label") || this.$autocomplete.find(".item:first > .tag-label");
        if(!$item.attr('value')) {
            return false;
        }
        return { id: $item.attr('value'), label: $item.text() };
    };


    /**
     * Adds a tag to input
     * @param location location object
     * @param protect defines if tag should be protected from deletion
     * @returns {boolean} true if tag has been added, false if not
     */
    namespace.locationInputComponent.prototype.addTag = function(location, protect) {
        if(!location) {
            return false;
        }
        var $tag = this.getLocationTemplate();
        var text = location.label;
        $tag.find(".tag-label").text(text);
        if(!protect) {
            $tag.find('.close').show();
        }
        $tag.attr('data-id', location.id);
        this.$adder.before($tag);
        this._refreshState();
        return true;
    };
    
    
    namespace.locationInputComponent.prototype.beforeTagAdded = function(text) {
        if(!text.startsWith(this._autoPrepend)){
            text = this._autoPrepend+text;
        }
        
        return text;
    };
    
    namespace.locationInputComponent.prototype.setAutocomplete = function(items) {
        this.$autocomplete.html("");
        var self = this;
        items.forEach(function(item){
            if(self.hasTag(item.description)){
                return;
            }
            self._cacheLocations[item.place_id] = item;
            var $div = $("<div>");
            $div.addClass("item");
            var $span = $("<span>");
            $span.addClass("tag-label");
            $span.html(item.description);
            $div.append($span);
            $span.attr("value", item.place_id);
            self.$autocomplete.append($div);
        });
        return true;
    };
    

    

    namespace.locationInputComponent.prototype._refreshState = function(search, showChoices) {
        var count = this.getTagCount();
        this.$element[count >= this._maxTags ? 'addClass' : 'removeClass']("max-tags");
    };
    
    
    namespace.locationInputComponent.prototype.getTagCount = function() {
        return this.$input.find(".tag").length;
    };
    
    
    
    namespace.locationInputComponent.prototype.getEditableValue = function() {
        return this.$adderEditable.text().trim();
    };
    
    
    
    namespace.locationInputComponent.prototype.cancelRequest = function() {
        if(!this._xhr){
            return;
        }
        this._xhr.abort();
    };
    
    namespace.locationInputComponent.prototype.doRequestDelay = function() {
        clearTimeout(this._requestDelay);
        var self = this;
        this._requestDelay = setTimeout(function(){
            self.doRequest();
        }, 300);
        
    };
    
    namespace.locationInputComponent.prototype.doRequest = function() {
        var self = this;
        var parameters = {
            input: self.getEditableValue(),
            language: this._language
        };

        return app.services.api.google.maps.getApi().then(function(google){
            if(!self._locationService){
                self._locationService = new google.maps.places.AutocompleteService();
            }
            return self._locationService;
        }).then(function(service){
            service.getPredictions(parameters, function(places) {
                self.setAutocomplete(places);
            });

            return true;
        }).fail(function(){
            console.error(arguments);
        })
    };
    
    
    namespace.locationInputComponent.prototype._autoCompleteWait = function() {
        var $wait = $("<div>");
        $wait.addClass("wait");
        $wait.html(app.services.ui.progress.getSVG());
        this.$autocomplete.html($wait);
    };
    
    namespace.locationInputComponent.prototype.getAutoComplete = function() {
        var length = this.getEditableValue().length;
        this.cancelRequest();
        if(length < 3){
            this.setAutocomplete([]);
            return;
        }
        this._autoCompleteWait();
        
        this.doRequestDelay();
        
        return true;
    };
    
    
    namespace.locationInputComponent.prototype.getTag = function(tag) {
        tag = tag.trim().toLowerCase();
        return this.$input.find(".tag .tag-label").filter(function(){
            var selfTag =  $(this).text().trim().toLowerCase();
            return selfTag == tag;
        });
    };
    
    namespace.locationInputComponent.prototype.hasTag = function(tag) {
        return this.getTag(tag).length;
    };
    
    
    namespace.locationInputComponent.prototype.getValue = function() {
        var tags = [];
        
        this.$input.find(".tag").each(function(){
            var location = {
                id: $(this).attr('data-id'),
                label: $(this).find('.tag-label').text().trim()
            };
            tags.push(location);
        });
        return tags;
    };

    namespace.locationInputComponent.prototype.getFullValue = function() {
        var tags = this.getValue();
        var self = this;
        var newArr = [];
        tags.forEach(function (item) {
            newArr.push(self.getPlace(item.id).then(function (data) {
                item.data = data;

                return item;
            }));
        });


        return  Q.all(newArr);
    };

    namespace.locationInputComponent.prototype.setValue = function(values) {
        if(!values.forEach){
            return false;
        }
        var self = this;
        values.forEach(function(tag){
            self.addTag(tag);
        });
        return true;
    };

    
    
    namespace.locationInputComponent.prototype.blinkTag = function(tag) {
        var $tag = this.getTag(tag);
        if(!$tag.length){
            return false;
        }
        
        app.services.ui.animations.blink($tag);
        
        return true;
    };
    
    
    namespace.locationInputComponent.prototype.placeCaretAtEnd = function () {
        var el = this.$adderEditable[0];
        el.focus();
        if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    };
    
    
    
    
    namespace.locationInputComponent.prototype.focusNextElement = function (e) {
        if($("html").is(".chrome")){
            return false;
        }
        if(!this.params.focusNextSelector){
            return false;
        }
        var $el = $(this.params.focusNextSelector);
        if(!$el.length){
            return false;
        }
        e.preventDefault();
        $el.focus();
        return true;
    };
    /**
     * Sets delete-protected tags
     * @param tags array of tags (strings)
     */
    namespace.locationInputComponent.prototype.setBlockedTags = function (tags) {
        this.$input.find('.tag').has('.close:hidden').remove();
        for(var i in tags){
            this.addTag(tags[i], true);
        }

        return this;
    };


    namespace.locationInputComponent.prototype.getPlaceService = function (id) {
        return app.services.api.google.maps.getApi().then(function (google) {
            if (!self._placeService) {
                self._placeService = new google.maps.places.PlacesService(document.createElement('div'));
            }
            return self._placeService;
        });
    };



   namespace.locationInputComponent.prototype.getPlace = function (id) {
       var self = this;
       return this.getPlaceService().then(function (placeService) {
           var item = self._cacheLocations[id];
           if (!item) {
               return null;
           }

           var deferred = Q.defer();
           placeService.getDetails({reference: item.reference}, function(details, status){
               deferred.resolve(details);
           });

           return deferred.promise;
       });
   };

    

    


    return namespace.locationInputComponent;
})(__ARGUMENT_LIST__);