<?php

namespace XVEngine\Bundle\LoactionInputBundle\Component\Input;


use XVEngine\Core\Component\Input\AbstractInputComponent;

class LocationInputComponent extends AbstractInputComponent {


    /**
     * @author Krzysztof Bednarczyk
     */
    public function initialize() {
        $this->setComponentName('input.locationInputComponent');
        parent::initialize();
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

}
