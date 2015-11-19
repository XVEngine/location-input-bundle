(function(namespace, app, globals) {

    namespace.locationInputComponent = app.newClass({
        extend: function () {
            return app.core.component.input.abstractInputComponent;
        }
    });

    namespace.locationInputComponent.prototype.getTemplate = function() {
        var tmplString = app.utils.getString(function() {
            //@formatter:off
            /**<string>
                <xv-location-input class="event-insert">
                   <label>
                       <span class="label fcolor-after"></span>
                       <div>
                            <input type="text" class="input" value="">
                            <div class="clear-input">
                                <i class="icon search icon-search"></i>
                                <i class="icon close icon-close"></i>
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



    namespace.locationInputComponent.prototype.getDefaultParams = function() {
        return {
            placeholder : "",
            value : null,
            focusNextSelector : null
        };
    };
    
    
    namespace.locationInputComponent.prototype.prepare = function() {
        this._cacheLocations = {};
        this.$autocomplete = this.$element.find("> .autocomplete");
        this.$clearInput = this.$element.find(".clear-input");
        this.setPlaceholder(this.params.placeholder);
        this.initEvents();
    };
    

    
    namespace.locationInputComponent.prototype.setPlaceholder = function(value) {
        this.$input.attr("placeholder", value);
        return this;
    };

    
    namespace.locationInputComponent.prototype.initEvents = function (value) {
        var self = this;


        this.$input.on("input", function (e) {
            self._value = null;
            self.$element.removeClass("has-value");
            self.getAutoComplete();
        });

        this.$clearInput.on("click", function (e) {
            self.setValue(null);
            return false;
        });

        this.$input.on("focusout", function (e) {
            setTimeout(function(){
                self.cancelRequest();
                self.setAutocomplete([]);
            }, 100);
        });


        
        this.$input.on("keydown", function(e){
            var charCode = !e.charCode ? e.which : e.charCode;
            var allowedKeys = [
                $.ui.keyCode.LEFT,
                $.ui.keyCode.RIGHT
            ];


            if(charCode === $.ui.keyCode.TAB){
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

            self.onInput();
            return true;
        });

        
        this.$autocomplete.on("click" , "> div.item ", function(){
            self.setValue({id: $(this).find('> .tag-label').attr('value'), label: $(this).find('> .tag-label').text()});
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

        
        return true;
    };


    namespace.locationInputComponent.prototype.validators = {
        "required": function(value) {
            if(!this._required){
                return true;
            }

            return !!this._value
        }
    };

    
    namespace.locationInputComponent.prototype.setInputValue = function(value) {
        this.$input.text(value);
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
        var $item =  this.$autocomplete
                .find(".item.selected:first > .tag-label") ||
            this.$autocomplete.find(".item:first > .tag-label");
        if(!$item.attr('value')) {
            return false;
        }
        return { id: $item.attr('value'), label: $item.text() };
    };


    
    namespace.locationInputComponent.prototype.setAutocomplete = function(items) {
        this.$autocomplete.html("");
        var self = this;
        items && items.forEach(function(item){
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
            input: this.getInputValue(),
            language: this._language
        };

        return app.service.api.google.maps.getApi().then(function(google){
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
        $wait.html(app.service.ui.progress.getSVG());
        this.$autocomplete.html($wait);
    };


    namespace.locationInputComponent.prototype.getInputValue = function() {
        return this.$input.val().trim();
    };
    
    namespace.locationInputComponent.prototype.getAutoComplete = function() {
        var length = this.getInputValue().length;
        this.cancelRequest();
        if(length < 3){
            this.setAutocomplete([]);
            return;
        }
        this._autoCompleteWait();
        
        this.doRequestDelay();
        
        return true;
    };


    namespace.locationInputComponent.prototype.convertLocation = function(place){
        return {
            "lat" : place.lat(),
            "lng" : place.lng()
        };
    };


    namespace.locationInputComponent.prototype.getValue = function() {
        if(!this._value){
            return null;
        }
        var self = this;
        return this.getPlace(this._value.id).then(function(place){

            return {
                "id" : place.id,
                "place_id" : place.place_id,
                "formatted_address" : place.formatted_address,
                "types" : place.types,
                "url" : place.url,
                "name" : place.name,
                "vicinity" : place.vicinity,
                "geometry" : {
                    "location" : self.convertLocation(place.geometry.location),
                    "viewport" : !place.geometry.viewport ?  null : {
                        "center" : self.convertLocation(place.geometry.viewport.getCenter()),
                        "northEast" : self.convertLocation(place.geometry.viewport.getNorthEast()),
                        "southWest" : self.convertLocation(place.geometry.viewport.getSouthWest())
                    }
                }
            }
        })
    };


    namespace.locationInputComponent.prototype.setValue = function(value) {
        this._value = value;
        this.$element[value ? 'addClass' : 'removeClass' ]("has-value");
        this.$input.val(value ? value.label : "");
        return true;
    };





    namespace.locationInputComponent.prototype.getPlaceService = function (id) {
        return app.service.api.google.maps.getApi().then(function (google) {
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