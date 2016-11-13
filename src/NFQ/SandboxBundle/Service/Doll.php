<?php
/**
 * Created by PhpStorm.
 * User: ES4B
 * Date: 10/28/16
 * Time: 21:29
 */

namespace NFQ\SandboxBundle\Service;

class Doll extends DollAbstract
{

    /**
     * Singleton Pattern
     * Ensures a class has only one instance and provide a global point to retrieve it
     */

    private $head;

    private $leftArm;

    private $rightArm;

    private $body;

    private $leftLeg;

    private $rightLeg;

    // Presence of a static member variable
    private static $_doll = null;

    // Prevent any outside instantiation of this class
    private function  __construct() { }

    // Prevent any object or instance of that class to be cloned
    private function  __clone() { }

    // Have a single globally accessible static method
    public static function getDoll()
    {
        if( !is_object(self::$_doll) )
            self::$_doll = new Doll();

        return self::$_doll;
    }

    /**
     * @return mixed
     */
    public function getHead()
    {
        return $this->head;
    }

    /**
     * @param mixed $head
     * @return Doll
     */
    public function setHead($head)
    {
        $this->head = $head;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLeftArm()
    {
        return $this->leftArm;
    }

    /**
     * @param mixed $leftArm
     * @return Doll
     */
    public function setLeftArm($leftArm)
    {
        $this->leftArm = $leftArm;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRightArm()
    {
        return $this->rightArm;
    }

    /**
     * @param mixed $rightArm
     * @return Doll
     */
    public function setRightArm($rightArm)
    {
        $this->rightArm = $rightArm;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getBody()
    {
        return $this->body;
    }

    /**
     * @param mixed $body
     * @return Doll
     */
    public function setBody($body)
    {
        $this->body = $body;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLeftLeg()
    {
        return $this->leftLeg;
    }

    /**
     * @param mixed $leftLeg
     * @return Doll
     */
    public function setLeftLeg($leftLeg)
    {
        $this->leftLeg = $leftLeg;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getRightLeg()
    {
        return $this->rightLeg;
    }

    /**
     * @param mixed $rightLeg
     * @return Doll
     */
    public function setRightLeg($rightLeg)
    {
        $this->rightLeg = $rightLeg;
        return $this;
    }

}