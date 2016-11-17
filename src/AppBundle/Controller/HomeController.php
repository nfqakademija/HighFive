<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\Request;

class HomeController extends Controller
{

    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        // temporarily, will need separate service
        $path = $this->get('kernel')->locateResource('@AppBundle/Resources/images/bones/');

        $finder = new Finder();
        $finder->files()->in($path);

        foreach ($finder as $file) {
            $files[] = $file->getFilename();
        }

        $data = [
            'images' => json_encode($files)
        ];

        return $this->render('AppBundle:Home:index.html.twig', $data);
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
}
