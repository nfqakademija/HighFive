<?php
/**
 * Created by PhpStorm.
 * User: ES4B
 * Date: 10/28/16
 * Time: 22:01
 */

namespace NFQ\SandboxBundle\Event;

use NFQ\SandboxBundle\Service\Doll;

class EventListener
{
    /**
     * @param PreCreateEvent $event
     */

    public function makeChanges($event) {
        /**
         * @var Doll $doll
         */
        
        $doll = $event->getDoll();
        $doll
//            ->setHead('head1')
//            ->setBody('body1')
            ->setLeftArm('left_arm1')
            ->setRightArm('right_arm1')
//            ->setLeftLeg('left_leg1')
//            ->setRightLeg('right_leg1')
        ;
    }
}