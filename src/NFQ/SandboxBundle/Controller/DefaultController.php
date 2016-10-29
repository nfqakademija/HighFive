<?php

namespace NFQ\SandboxBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        $doll = $this->get('app.doll');

        $data = [
            'head' => $doll->getHead(),
            'left_arm' => $doll->getLeftArm(),
            'right_arm' => $doll->getRightArm(),
            'body' => $doll->getBody(),
            'left_leg' => $doll->getLeftLeg(),
            'right_leg' => $doll->getRightLeg(),
        ];

        return $this->render('NFQSandboxBundle:Default:index.html.twig', [
            'doll' => $data
        ]);
    }
}
