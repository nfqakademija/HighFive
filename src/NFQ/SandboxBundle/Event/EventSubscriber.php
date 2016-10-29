<?php
/**
 * Created by PhpStorm.
 * User: ES4B
 * Date: 10/29/16
 * Time: 20:42
 */

namespace NFQ\SandboxBundle\Event;

use NFQ\SandboxBundle\Service\Doll;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class EventSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return array(
            Events::PRE_CREATE => 'onMakeChanges',
        );
    }

    public function onMakeChanges($event)
    {
        /**
         * @var Doll $doll
         */

        $doll = $event->getDoll();
        $doll
//            ->setHead('head2')
//            ->setBody('body2')
//            ->setLeftArm('left_arm2')
//            ->setRightArm('right_arm2')
            ->setLeftLeg('left_leg2')
            ->setRightLeg('right_leg2')
        ;
    }
}