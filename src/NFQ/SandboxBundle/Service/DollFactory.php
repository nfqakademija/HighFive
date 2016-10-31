<?php
/**
 * Created by PhpStorm.
 * User: ES4B
 * Date: 10/28/16
 * Time: 21:50
 */

namespace NFQ\SandboxBundle\Service;

use NFQ\SandboxBundle\Event\Events;
use NFQ\SandboxBundle\Event\PreCreateEvent;
use Symfony\Component\EventDispatcher\EventDispatcher;

class DollFactory
{
    /**
     * @var EventDispatcher
     */
    private $eventDispatcher;

    /**
     * DollFactory constructor.
     * @param EventDispatcher $eventDispatcher
     */
    public function __construct($eventDispatcher)
    {
        $this->eventDispatcher = $eventDispatcher;
    }

    public function create() {
        $doll = Doll::getDoll();

        $doll
            ->setHead('head')
            ->setBody('body')
            ->setLeftArm('left_arm')
            ->setRightArm('right_arm')
            ->setLeftLeg('left_leg')
            ->setRightLeg('right_leg');

        // overwrite with eventListener
        $this->eventDispatcher->dispatch(Events::LIS_CREATE, new PreCreateEvent($doll));

        // overwrite with eventSubscriber
        $this->eventDispatcher->dispatch(Events::SUB_CREATE, new PreCreateEvent($doll));

        return $doll;
    }
}