<?php
/**
 * Created by PhpStorm.
 * User: ES4B
 * Date: 10/28/16
 * Time: 21:29
 */

namespace NFQ\SandboxBundle\Service;

abstract class DollAbstract
{

    abstract protected function getHead();
    abstract protected function getBody();
    abstract protected function getLeftArm();
    abstract protected function getRightArm();
    abstract protected function getLeftLeg();
    abstract protected function getRightLeg();

}