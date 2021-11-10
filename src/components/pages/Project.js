import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Loading from '../layout/Loading';
import Container from '../layout/Container';
import Message from '../layout/Message';
import ProjectForm from '../project/ProjectForm';

import styles from './Project.module.css';

function Project() {
    const { id } = useParams();

    const [project, setProject] = useState([]);
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
                            <h1>Adicione um serviço:</h1>
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
                                    <div>Formulário do serviço</div>
                                )}
                            </div>
                            <h2>Serviços</h2>
                            <Container className="start">
                                <p>Itens de servico</p>
                            </Container>
                        </div>
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}

export default Project;
