'use client'

import { Project } from "@/types";
import Image from 'next/image'
import { GithubLink, LinkOutlined, PlaystoreLink, WebsiteLink } from "./commons/Buttons";
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import { useScrollProject } from "@/hooks/useScroll";
import { useRef } from 'react'
import { useInView } from "react-intersection-observer";
import clsx from "clsx";

export default function Projects({ projects }: { projects: Project[] }) {

    const divRef = useRef<HTMLDivElement>(null)

    const scrollProject = (next: boolean) => {
        const htmlFontSize = getComputedStyle(document.documentElement).fontSize
        let scrollAmount = 24 * parseFloat(htmlFontSize)

        scrollAmount = next ? scrollAmount : -scrollAmount

        divRef.current?.scrollBy({
            top: scrollAmount,
        })
    }



    const nextProject = () => {
        scrollProject(true)
    }

    const previousProject = () => {
        scrollProject(false)
    }

    return (
        <div id="Projects" className="w-screen h-full p-12 md:p-24 ">
            <p className="text-purple-500 text-3xl md:text-4xl mb-8">Projects</p>

            <div className="flex flex-col gap-8 mb-8" ref={divRef}>
                {projects.map((project, index) => {
                    return <FeaturedProjectCard key={`project-${index}`} project={project} previousProject={previousProject} nextProject={nextProject} />
                })
                }
            </div>

            <LinkOutlined href="https://github.com/IDIRYACINE/" className="block text-center">See all</LinkOutlined>

        </div>
    )
}


interface FeatureProjectCardProps {
    project: Project
    nextProject: () => void
    previousProject: () => void
}
function FeaturedProjectCard({ project, nextProject, previousProject }: FeatureProjectCardProps) {
    const imgRef = useRef<HTMLImageElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)

    const onFirstVisible = (inView:boolean,entry:IntersectionObserverEntry) => {
        if(inView){
            imgRef.current?.classList.add("fade-in-and-move-up")
            cardRef.current?.classList.add("fade-in-and-move-left")
            
        }
    }
    
    const { ref } = useInView({triggerOnce: true,onChange:onFirstVisible,})




    const cardConatinterClassName = clsx([
        "w-full md:w-1/2 h-full z-10  flex justify-start items-center ",
    ])


    return (
        <div ref={ref} className="relative flex flex-row w-full h-96 " >
            
            <div ref={cardRef} className={cardConatinterClassName}>
                <div className="relative w-full h-full md:w-96 md:h-96 flex flex-col justify-evenly items-start p-8 shadow-lg bg-alternative/75 md:bg-alternative  ">
                    <p className="font-extrabold text-left text-white text-2xl md:text-3xl">{project.name}</p>
                    <p className="text-left text-white text-lg md:text-xl">{project.previewDescription.join()}</p>
                    <ActionsList project={project}/>
                </div>

            </div>

            <div  >
                <Image  ref={imgRef} fill={true} src={project.previewImage} alt={project.name} />
            </div>
            {/* 
            <div className="w-1/2 h-full flex justify-evenly items-center">
                <button className="z-10" onClick={nextProject}>
                    <ArrowCircleDownOutlinedIcon className=" text-9xl fill-purple-500" />

                </button>
                <button className="z-10"  onClick={previousProject}>
                    <ArrowCircleUpOutlinedIcon className="text-9xl fill-purple-500" />

                </button>
            </div> */}

        </div>
    )
}


function ActionsList({project}: {project: Project}){


    const Gituhb = () => {
        if(project.actions.github){
            return <GithubLink className="text-4xl" href={project.actions.github} />
        }
        return null
    }

    const Website = () => {
        if(project.actions.website){
            return <WebsiteLink className="text-4xl" href={project.actions.website} />
        }
        return null
    }

    const PlayStore = () => {
        if(project.actions.playstore){
                return  <PlaystoreLink className="text-4xl" href={project.actions.playstore} />
        }
        return null
    }

    return (
        <div className="flex flex-row justify-start gap-4">
            <Gituhb />
            <Website />
            <PlayStore />
        </div>
    )
}