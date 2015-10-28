<?php

namespace Tattool\Bundle\ComponentsBundle\Component\Form\Input;

use Tattool\Bundle\ComponentsBundle\Component\Form\AbstractInput;

class LocationInputComponent extends AbstractInput {

  
    
    public function init() {
        $this->setComponentName('form.input.locationInputComponent');
        parent::init();
    }
    
    /**
     * 
     * @param string $value
     * @return TagInputComponent
     */
    public function setAutoPrepend($value){
        $this->setParam('autoPrepend', $value);
        
        return $this;
    }
    
    /**
     * 
     * @param string $value
     * @return TagInputComponent
     */
    public function setPlaceholder($value){
        $this->setParam('placeholder', $value);
        
        return $this;  
    }
    
    
    /**
     * 
     * @param int $value
     * @return TagInputComponent
     */
    public function setMaxTags($value){
        $this->setParam('maxTags', (int) $value);
        
        return $this;  
    }
    
    /**
     * 
     * @param string $url
     * @return TagInputComponent
     */
    public function setURL($url){
        $this->setParam('url', $url);
        
        return $this;  
    }
    
    /**
     * 
     * @param boolean $value
     * @return TagInputComponent
     */
    public function setOnlyFromAutocomplete($value){
        $this->setParam('onlyFromAutoComplete', !!$value);
        
        return $this;  
    }


    /**
     * @param $tags
     *
     * @return $this
     */
    public function setValue($tags){
        $this->setParam("value" , $tags);
        return $this;
    }


    /**
     * @param $selector
     *
     * @return $this
     */
    public function setFocusNextSelector($selector){
        $this->setParam("focusNextSelector", $selector);
        return $this;
    }

    /**
     *
     * @param string $key
     * @return TagInputComponent
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
