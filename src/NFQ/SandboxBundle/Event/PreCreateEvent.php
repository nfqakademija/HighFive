<?php
/**
 * Created by PhpStorm.
 * User: ES4B
 * Date: 10/28/16
 * Time: 22:03
 */

namespace NFQ\SandboxBundle\Event;

use Symfony\Component\EventDispatcher\Event;

class PreCreateEvent extends Event
{
    private $doll;

    /**
     * PreCreateEvent constructor.
     * @param $doll
     */
    public function __construct($doll)
    {
        $this->doll = $doll;
    }

    /**
     * @return mixed
     */
    public function getDoll()
    {
        return $this->doll;
    }

    /**
     * @param mixed $doll
     * @return PreCreateEvent
     */
    public function setDoll($doll)
    {
        $this->doll = $doll;
        return $this;
    }

}