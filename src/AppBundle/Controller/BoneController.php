<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Bone;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

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

    /**
     * @Route("/bones/{id}")
     * @param $id
     * @return Response
     */
    public function showAction($id)
    {
        $bone = $this->getDoctrine()
            ->getRepository('AppBundle:Bone')
            ->getBone($id);

        return $this->render('AppBundle:Bone:index.html.twig', ['bone' => $bone]);
    }

    /**
     * @Route("/api/levels")
     * @return Response
     */
    public function getLevels()
    {
        $levels = $this->getDoctrine()
            ->getRepository('AppBundle:Level')
            ->getLevels();

        return new JsonResponse(['levels' => $levels]);
    }
}