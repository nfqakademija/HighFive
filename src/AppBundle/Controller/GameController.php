<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class GameController extends Controller
{
    /**
     * @Route("/game", name="gamepage")
     */
    public function indexAction()
    {
        $data = ['type' => 'game'];

        return $this->render('AppBundle:Game:game.html.twig', $data);
    }

    /**
     * @Route("/learn", name="learnpage")
     */
    public function gameAction() {
        $data = ['type' => 'learn'];

        return $this->render('AppBundle:Game:learn.html.twig', $data);
    }
}
