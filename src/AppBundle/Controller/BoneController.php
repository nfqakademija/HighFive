<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Entity\Bone;
use Symfony\Component\HttpFoundation\JsonResponse;


class BoneController extends Controller
{
    /**
     * @Route("/bones")
     */
    public function allBones()
    {
        $bones = $this->getDoctrine()
            ->getRepository('AppBundle:Bone')
            ->getBones();

        return new JsonResponse(['bones' => $bones]);
    }
}
