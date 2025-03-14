import { useState, useEffect, useContext } from 'react'
import "./ProjectsList.css"

// ASSETS //
import Like from '../../assets/like.svg'
import LikeTransparente from '../../assets/like-transparente.svg'

// COMPONENTS 

import Button from '../button/Button'

// UTILS 
import { getApiData } from '../../Services/apiServices'

// CONTEXT 
import { AppContext } from '../../Contexts/AppContext'



function Projectslist() {

    const appContext = useContext(AppContext)
    const [favProjects, setFavProjects] = useState([]);
    const [projects, setProjects] = useState([]);

    const handleSavedProjects = (id) => {
        setFavProjects((prevFavProjects) => {
            if (prevFavProjects.includes(id)) {
                const filterArray = prevFavProjects.filter((projectId) => projectId !== id)
                sessionStorage.setItem('favProjects', JSON.stringify(filterArray))
                return prevFavProjects.filter((projectId) => projectId !== id)
            }else {
                sessionStorage.setItem('favProjects', JSON.stringify([...prevFavProjects, id]))
                return [...prevFavProjects, id]
            }
        } )
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectsResponse = await getApiData('projects')
                setProjects(projectsResponse)
            } catch {
                setProjects([])
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const savedFavprojects = JSON.parse(sessionStorage.getItem('favProjects'))
        if (savedFavprojects) {
            setFavProjects(savedFavprojects)
        }
    }, [])

    return (
        <div className="projects-section">
            <div className="projects-hero">
                <h2> {appContext.languages[appContext.language].projects.title}</h2>
                <p> {appContext.languages[appContext.language].projects.subtitle}</p>
            </div>
            <div className="projects-grid">
                {
                    projects ?
                        projects.map((project) => (
                            <div className="project-card d-flex jc-center al-center fd-column" key={project.id}>
                                <div className="thumb tertiary-background" style={{ backgroundImage: `url(${project.thumb})` }}></div>
                                <h3>{project.title}</h3>
                                <p>{project.subtitle}</p>
                                <Button buttonStyle="unstyled" onClick={() => handleSavedProjects(project.id)} >
                                <img src={favProjects.includes(project.id) ? Like : LikeTransparente } height="20px" /> 
                                </Button>
                            </div>
                        ))
                        :
                        null
                }
            </div>
        </div>
    )

}


export default Projectslist 