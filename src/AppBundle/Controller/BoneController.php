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
     * @Route("/bones", name="bonespage")
     */
    public function allBones()
    {
        $bones = $this->getDoctrine()
            ->getRepository('AppBundle:Bone')
            ->getBones();

        return new JsonResponse(['bones' => $bones]);
    }

    /**
     * @Route("/bone/{id}", name="bonepage", requirements={"id" = "\d+"}, defaults={"id" = 1})
     */
    public function getBone($id)
    {
        // get data from repository about bone from id
        $data = [
            'id' => $id
        ];

        return $this->render('AppBundle:Bone:index.html.twig', $data);
    }
}
