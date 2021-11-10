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

    function editPost(project) {
        // Necessário para exibir mais de uma vez o componente de mensagem quando não há alteração na mensagem exibida
        setMessage('');

        if (project.budget < project.cost) {
            setMessage(
                'O orçamento não pode ser menor que o custo do projeto!'
            );
            setMessageType('error');
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
                setMessage('Projeto atualizado!');
                setMessageType('success');
            })
            .catch((err) => console.log(err));
    }

    function toggleForm(setShowForm, showForm) {
        return () => setShowForm(!showForm);
    }

    function createService(project) {
        setMessage('');

        const lastService = project.services[project.services.length - 1];

        lastService.id = uuidv4();

        const lastServiceCost = lastService.cost;

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost);

        if (newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado! Verifique o valor do serviço.');
            setMessageType('error');
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
            })
            .catch((err) => console.log(err));
    }

    function removeService() {}

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm);
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm);
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    {message && <Message type={messageType} msg={message} />}
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
