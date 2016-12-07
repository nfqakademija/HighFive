<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * Bone
 *
 * @ORM\Table(name="bone")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\BoneRepository")
 * @Vich\Uploadable
 */
class Bone
{
    public function __toString()
    {
        return $this->getName();
    }

    private $levels;

    public function __construct()
    {
        $this->levels = new ArrayCollection();
    }

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string")
     */
    private $name;

    /**
     * @var integer
     *
     * @ORM\Column(name="sort", type="integer")
     */
    private $sort;

    /**
     * @return mixed
     */
    public function getLevels()
    {
        return $this->levels;
    }

    /**
     * @param mixed $levels
     */
    public function setLevels($levels)
    {
        $this->levels = $levels;
    }

    /**
     * @return int
     */
    public function getSort()
    {
        return $this->sort;
    }

    /**
     * @param int $sort
     */
    public function setSort($sort)
    {
        $this->sort = $sort;
    }

    /**
     * @var string
     *
     * @ORM\Column(name="latin", type="string", length=255)
     */
    private $latin;

    /**
     * @var string
     *
     * @ORM\Column(name="type", type="string", length=255)
     */
    private $type;

    /**
     * @var boolean
     *
     * @ORM\Column(name="visible", type="boolean")
     */
    private $visible;

    /**
     * @var string
     *
     * @ORM\Column(name="summary", type="string", length=250)
     */
    private $summary;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=2500)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=255)
     */
    private $image;

    /**
     * @var integer
     *
     * @ORM\Column(type="integer", length=255)
     */
    private $xcoord;

    /**
     * @var integer
     *
     * @ORM\Column(type="integer", length=255)
     */
    private $ycoord;

    /**
     *
     * @ORM\Column(type="float", length=255)
     */
    private $topcoord;

    /**
     *
     * @ORM\Column(type="float", length=255)
     */
    private $leftcoord;

    /**
     * @return string
     */
    public function getSummary()
    {
        return $this->summary;
    }

    /**
     * @param string $summary
     */
    public function setSummary($summary)
    {
        $this->summary = $summary;
    }

    /**
     * @return mixed
     */
    public function getTopcoord()
    {
        return $this->topcoord;
    }

    /**
     * @param mixed $topcoord
     * @return Bone
     */
    public function setTopcoord($topcoord)
    {
        $this->topcoord = $topcoord;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getLeftcoord()
    {
        return $this->leftcoord;
    }

    /**
     * @param mixed $leftcoord
     * @return Bone
     */
    public function setLeftcoord($leftcoord)
    {
        $this->leftcoord = $leftcoord;
        return $this;
    }

    /**
     * @var File
     *
     * @Vich\UploadableField(mapping="bone_images", fileNameProperty="image")
     */
    private $imageFile;

    /**
     * @ORM\Column(type="datetime")
     * @var \DateTime
     */
    private $updatedAt;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     * @return Bone
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     * @return Bone
     */
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    public function getImage()
    {
        return $this->image;
    }

    public function setImage($image)
    {
        $this->image = $image;
    }

    public function getImageFile()
    {
        return $this->imageFile;
    }

    /**
     * @return string
     */
    public function getLatin()
    {
        return $this->latin;
    }

    /**
     * @param string $latin
     * @return Bone
     */
    public function setLatin($latin)
    {
        $this->latin = $latin;
        return $this;
    }

    /**
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param string $type
     * @return Bone
     */
    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }

    /**
     * @return string
     */
    public function getVisible()
    {
        return $this->visible;
    }

    /**
     * @param string $visible
     * @return Bone
     */
    public function setVisible($visible)
    {
        $this->visible = $visible;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * @param \DateTime $updatedAt
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;
    }

    /**
     * @return string
     */
    public function getXcoord()
    {
        return $this->xcoord;
    }

    /**
     * @param string $xcoord
     */
    public function setXcoord($xcoord)
    {
        $this->xcoord = $xcoord;
    }

    /**
     * @return string
     */
    public function getYcoord()
    {
        return $this->ycoord;
    }

    /**
     * @param string $ycoord
     */
    public function setYcoord($ycoord)
    {
        $this->ycoord = $ycoord;
    }

    public function setImageFile(File $image = null)
    {
        $this->imageFile = $image;

        if ($image) {
            $this->updatedAt = new \DateTime('now');
        }
    }

    /**
     * Add level
     *
     * @param \AppBundle\Entity\Level $level
     *
     * @return Bone
     */
    public function addLevel(\AppBundle\Entity\Level $level)
    {
        $this->levels[] = $level;

        return $this;
    }

    /**
     * Remove level
     *
     * @param \AppBundle\Entity\Level $level
     */
    public function removeLevel(\AppBundle\Entity\Level $level)
    {
        $this->levels->removeElement($level);
    }
}
