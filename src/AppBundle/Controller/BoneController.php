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
     * @Route("/", name="homepage")
     */
    public function indexAction()
    {
        return $this->render('AppBundle:Home:index.html.twig', []);
    }

    /**
     * @Route("/list", name="posts_list")
     */
    public function listAction()
    {
        $exampleService = $this->get('app.example');

        $posts = $exampleService->getPosts();

        return $this->render('AppBundle:Home:list.html.twig', [
            'posts' => $posts,
        ]);
    }

    /**
     * @Route("/bone")
     */
    public function createAction()
    {
        $bone = new Bone();
        $bone->setName('Bone');
        $bone->setDescription('Ergonomic and stylish!');

        $em = $this->getDoctrine()->getManager();

        // tells Doctrine you want to (eventually) save the Product (no queries yet)
        $em->persist($bone);

        // actually executes the queries (i.e. the INSERT query)
        $em->flush();

        return new Response('Saved new product with id '.$bone->getId());
    }

    /**
     * @Route("/bone/{id}")
     */
    public function showAction($id)
    {
        $bone = $this->getDoctrine()
            ->getRepository('AppBundle:Bone')
            ->find($id);

        if (!$bone) {
            throw $this->createNotFoundException(
                'No bone found for id '.$bone
            );
        }
        return new Response($bone->getDescription());
    }
}
