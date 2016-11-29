<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class ThreeController extends Controller
{
    /**
     * @Route("/three", name="threepage")
     */
    public function indexAction()
    {
        return $this->render('AppBundle:Three:index.html.twig', []);
    }
}