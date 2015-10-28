<?php

namespace Tattool\Bundle\ComponentsBundle\Component\Form\Input;


use XVEngine\Core\Component\Input\AbstractInputComponent;

class LocationInputComponent extends AbstractInputComponent {


    /**
     * @author Krzysztof Bednarczyk
     */
    public function initialize() {
        $this->setComponentName('form.input.locationInputComponent');
        parent::initialize();
    }


    /**
     * @author Krzysztof Bednarczyk
     * @param $value
     * @return $this
     */
    public function setAutoPrepend($value){
        $this->setParam('autoPrepend', $value);
        
        return $this;
    }

    /**
     * @author Krzysztof Bednarczyk
     * @param $value
     * @return $this
     */
    public function setPlaceholder($value){
        $this->setParam('placeholder', $value);
        
        return $this;  
    }


    /**
     * @author Krzysztof Bednarczyk
     * @param $value
     * @return $this
     */
    public function setMaxTags($value){
        $this->setParam('maxTags', (int) $value);
        
        return $this;  
    }


    /**
     * @author Krzysztof Bednarczyk
     * @param $url
     * @return $this
     */
    public function setURL($url){
        $this->setParam('url', $url);
        
        return $this;  
    }

    /**
     * @author Krzysztof Bednarczyk
     * @param $value
     * @return $this
     */
    public function setOnlyFromAutocomplete($value){
        $this->setParam('onlyFromAutoComplete', !!$value);
        
        return $this;  
    }


    /**
     * @author Krzysztof Bednarczyk
     * @param mixed|string $tags
     * @return $this
     */
    public function setValue($tags){
        $this->setParam("value" , $tags);
        return $this;
    }


    /**
     * @author Krzysztof Bednarczyk
     * @param $selector
     * @return $this
     */
    public function setFocusNextSelector($selector){
        $this->setParam("focusNextSelector", $selector);
        return $this;
    }

    /**
     * @author Krzysztof Bednarczyk
     * @param $key
     * @return $this
     */
    public function setApiKey($key){
        $this->setParam('apiKey', $key);
        return $this;
    }


    /**
     *
     * @author Krzysztof Bednarczyk
     * @param array $tags
     * @return $this
     */
    public function setBlockedTags(array $tags){
        return $this->setParam("blockedTags", $tags);
    }
}
