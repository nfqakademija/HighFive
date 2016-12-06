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
    public function getAllBones()
    {
        $bones = $this->getDoctrine()
            ->getRepository('AppBundle:Bone')
            ->getBones();

        return new JsonResponse(['bones' => $bones]);
    }

    /**
     * @Route("/bone/{id}", name="bonepage", requirements={"id" = "\d+"}, defaults={"id" = 1})
     * @param $id
     * @return Response
     */
    public function getBone($id)
    {
        $bone = $this->getDoctrine()
            ->getRepository('AppBundle:Bone')
            ->getBone($id);

        return $this->render('AppBundle:Bone:index.html.twig', ['bone' => $bone]);
    }
}
