import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { parse, v4 as uuidv4 } from 'uuid';

import Loading from '../layout/Loading';
import Container from '../layout/Container';
import Message from '../layout/Message';
import ProjectForm from '../project/ProjectForm';
import ServiceForm from '../service/ServiceForm';
import ServiceCard from '../service/ServiceCard';

import styles from './Project.module.css';

function Project() {
    const { id } = useParams();

    const [project, setProject] = useState([]);
    const [services, setServices] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [messageService, setMessageService] = useState();
    const [messageServiceType, setMessageServiceType] = useState();

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((resp) => resp.json())
                .then((data) => {
                    setProject(data);
                    setServices(data.services);
                })
                .catch((err) => console.log(err));
        }, 300);
    }, [id]);

    // ENUM
    const MessageCategory = {
        PROJECT: 'project',
        SERVICE: 'service',
    };

    function editMessage(messageCategory, text, success) {
        let type = success ? 'success' : 'error';

        switch (messageCategory) {
            case MessageCategory.PROJECT:
                setMessage(text);
                setMessageType(type);
                break;

            case MessageCategory.SERVICE:
                setMessageService(text);
                console.log(messageCategory, text, type);
                setMessageServiceType(type);
                break;

            default:
                break;
        }
    }

    function editPost(project) {
        if (project.budget < project.cost) {
            editMessage(MessageCategory.PROJECT, 'O orçamento não pode ser menor que o custo do projeto!', false);
            return false;
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(data);
                setShowProjectForm(false);
                editMessage(MessageCategory.PROJECT, 'Projeto atualizado!', true);
            })
            .catch((err) => console.log(err));
    }

    function toggleForm(setShowForm, showForm) {
        return () => setShowForm(!showForm);
    }

    function createService(project) {
        const lastService = project.services[project.services.length - 1];

        lastService.id = uuidv4();

        const lastServiceCost = lastService.cost;

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost);

        if (newCost > parseFloat(project.budget)) {
            editMessage(MessageCategory.SERVICE, 'Orçamento ultrapassado! Verifique o valor do serviço.', false)
            project.services.pop();
            return false;
        }

        project.cost = newCost;

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setShowServiceForm(false);
                editMessage(MessageCategory.SERVICE, 'Serviço criado com sucesso!', true)
            })
            .catch((err) => console.log(err));
    }

    function removeService(id, cost) {
        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        );

        const projectUpdated = project;

        projectUpdated.services = servicesUpdated;
        projectUpdated.cost =
            parseFloat(projectUpdated.cost) - parseFloat(cost);

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectUpdated),
        })
            .then((res) => res.json())
            .then((data) => {
                setProject(projectUpdated);
                setServices(servicesUpdated);
                editMessage(MessageCategory.SERVICE, 'Serviço removido com sucesso!', true);
            })
            .catch((err) => console.log(err));
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    {message && <Message type={messageType} msg={message} msgHandler={setMessage} />}
                    <Container customClass="column">
                        <div className={styles.detail_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button
                                className={styles.btn}
                                onClick={toggleForm(
                                    setShowProjectForm,
                                    showProjectForm
                                )}
                            >
                                {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria: </span>
                                        {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total de Orçamento:</span> R$
                                        {project.budget}
                                    </p>
                                    <p>
                                        <span>Total Utilizado:</span> R$
                                        {project.cost}
                                    </p>
                                    <p>
                                        <span>Orçamento Restante:</span> R$
                                        {project.budget - project.cost}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm
                                        handleSubmit={editPost}
                                        btnText="Concluir Edição"
                                        projectData={project}
                                    />
                                </div>
                            )}
                        </div>
                        <div className={styles.service_form_container}>
                            {messageService && <Message type={messageServiceType} msg={messageService} msgHandler={setMessageService} />}
                            <h2>Adicione um serviço:</h2>
                            <button
                                className={styles.btn}
                                onClick={toggleForm(
                                    setShowServiceForm,
                                    showServiceForm
                                )}
                            >
                                {!showServiceForm
                                    ? 'Adicionar serviço'
                                    : 'Fechar'}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm
                                        handleSubmit={createService}
                                        btnText="Adicionar serviço"
                                        projectData={project}
                                    />
                                )}
                            </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass="start">
                            {services.length > 0 ? (
                                services.map((service) => (
                                    <ServiceCard
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        key={service.id}
                                        handleRemove={removeService}
                                    />
                                ))
                            ) : (
                                <p>Não há serviços cadastrados.</p>
                            )}
                        </Container>
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}

export default Project;
