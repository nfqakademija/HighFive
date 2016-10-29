<?php
/**
 * Created by PhpStorm.
 * User: ES4B
 * Date: 10/28/16
 * Time: 21:50
 */

namespace NFQ\SandboxBundle\Service;

use NFQ\SandboxBundle\Event\Events;
use NFQ\SandboxBundle\Event\EventSubscriber;
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
        $doll = new Doll();

        $doll
            ->setHead('head')
            ->setBody('body')
            ->setLeftArm('left_arm')
            ->setRightArm('right_arm')
            ->setLeftLeg('left_leg')
            ->setRightLeg('right_leg');

        $this->eventDispatcher->dispatch(Events::PRE_CREATE, new PreCreateEvent($doll));

//        $subscriber = new EventSubscriber();
//        $this->eventDispatcher->addSubscriber($subscriber);

        return $doll;
    }
}