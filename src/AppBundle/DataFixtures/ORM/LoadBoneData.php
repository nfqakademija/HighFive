<?php
namespace AppBundle\ORM\DataFixtures;

use AppBundle\Entity\Bone;
use Carbon\Carbon;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

class LoadUserData implements FixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $json = file_get_contents("src/AppBundle/Resources/scripts/bones.json");
        $array = json_decode($json, true);

        foreach ($array['bones'] as $key) {

            $bone = new Bone();

            $bone->setName($key['name']);
            $bone->setLatin($key['latin']);
            $bone->setType($key['type']);
            $bone->setSummary($key['summary']);
            $bone->setDescription($key['description']);
            $bone->setVisible($key['visible']);
            $bone->setImage($key['image']);
            $bone->setXcoord($key['xcoord']);
            $bone->setYcoord($key['ycoord']);
            $bone->setTopcoord($key['topcoord']);
            $bone->setLeftcoord($key['leftcoord']);
            $bone->setUpdatedAt(Carbon::now());

            $manager->persist($bone);
        }
        $manager->flush();
    }
}