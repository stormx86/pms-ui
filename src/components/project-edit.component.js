import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import EventBus from "../common/EventBus";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ProjectService from "../services/project.service";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import validate from "../validators/new-project-validator";
import Modal from "react-bootstrap/Modal";

export default function ProjectEdit() {
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get('projectId');

    const [rolesData, setRolesData] = useState([]);

    const [projectCreator, setProjectCreator] = useState('');
    const [projectManager, setProjectManager] = useState('');
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectStatus, setProjectStatus] = useState('');
    const [newRolesList, setNewRolesList] = useState([]);

    const [errors, setErrors] = useState({title: '', description: '', projectManager:'', roleErrors:[]});
    const roleUserInputValidationErrors = errors.roleErrors;

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleClose = () => {
        setShowSuccessModal(false);
        window.location.href = '/projects/project?projectId='+projectId
    };

    const handleAddRole = () => {
        setNewRolesList([...newRolesList, {projectRoleName: 'Engineer', userName: ''}]);
    };

    const handleRemoveRole = index => {
        const list = [...newRolesList];
        list.splice(index, 1);
        setNewRolesList(list);
        setErrors('');
    };

    const updateSelectedRoles = index => e => {
        let newArr = [...newRolesList];
        newArr[index].projectRoleName = e.target.value;
        setNewRolesList(newArr);
    };

    const updateUsernamesForRoles = index => e => {
        let newArr = [...newRolesList];
        newArr[index].userName = e.target.value;
        setNewRolesList(newArr);
        setErrors('');
    };

    const updatedProject = {
        projectId: projectId,
        creator: projectCreator,
        projectManager: projectManager,
        title: projectTitle,
        description: projectDescription,
        status: projectStatus,
        userProjectRoleDto: newRolesList
    };

    getProjectData(
        setProjectCreator,
        setProjectManager,
        setProjectTitle,
        setProjectDescription,
        setProjectStatus,
        setNewRolesList,
        projectId);

    getAllProjectRoleNames(setRolesData);


    return (
        <Container fluid="true">
            <Row>
                <Col xs={4}>
                    <Card border="secondary" style={{width: '25rem'}}>
                        <Card.Header>
                            <Card.Title>
                                Project Members
                            </Card.Title>
                        </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <Row style={{alignItems: 'center'}}>
                                    <Col xs={6}>
                                        Creator:
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Control type="text" value={projectCreator} readOnly={1}/>
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row style={{alignItems: 'center'}}>
                                    <Col xs={6}>
                                        Project Manager:
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Control type="text" value={projectManager}
                                                      onChange={e =>{
                                                          setErrors('');
                                                          setProjectManager(e.target.value)}}/>
                                        {errors.projectManager && (<Alert variant="danger">{errors.projectManager}</Alert>)}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            {newRolesList &&
                            newRolesList.map((roles, index) => {
                                return (

                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col xs={6}>
                                                <Form.Select value={roles.projectRoleName}
                                                             onChange={updateSelectedRoles(index)}>
                                                    {rolesData &&
                                                    rolesData.map((role) => {
                                                        return (
                                                            <option key={role.projectRoleId}
                                                                    value={role.roleName}>{role.roleName}</option>
                                                        );
                                                    })}
                                                </Form.Select>
                                            </Col>
                                            <Col xs={6}>
                                                <InputGroup className="mb-3">
                                                    <Form.Control type="text" value={roles.userName} onChange={updateUsernamesForRoles(index)}/>
                                                    <Button size="sm" variant="danger" onClick={() => handleRemoveRole(index)}>-</Button>
                                                    {roleUserInputValidationErrors && roleUserInputValidationErrors.includes(index) && (<Alert variant="danger">Field is required</Alert>)}
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                );
                            })}
                            <Button size="sm" variant="secondary" onClick={handleAddRole}>Add new role</Button>
                        </ListGroup>
                    </Card>
                    <br/>
                    <Button variant="success" onClick={() => {updateProject(projectId, updatedProject, setErrors, setShowSuccessModal)}}>Update</Button>{' '}
                </Col>
                <Col xs={5}>
                    <Card border="secondary" style={{width: '53rem'}}>
                        <Card.Header>
                            <Card.Title>
                                Project Title
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <Form.Control size="lg" type="text" placeholder="Put project title here..."
                                              value={projectTitle} onChange={e =>{
                                    setErrors('');
                                    setProjectTitle(e.target.value)}}/>
                                {errors.title && (<Alert variant="danger">{errors.title}</Alert>)}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <br/>
                    <Card border="secondary" style={{width: '53rem'}}>
                        <Card.Header>
                            <Card.Title>
                                Project Description
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <Form.Control as="textarea" rows={4} placeholder="Put project description here..."
                                              value={projectDescription} onChange={e =>{
                                    setErrors('');
                                    setProjectDescription(e.target.value)}}/>
                                {errors.description && (<Alert variant="danger">{errors.description}</Alert>)}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showSuccessModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>!!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Project has been successfully updated</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

function getAllProjectRoleNames(setRolesData) {
    useEffect(() => {
        ProjectService.getAllProjectRoleNames().then(
            response => {
                setRolesData(response.data);
            },
            error => {
                setRolesData(
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString()
                );

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }, [])
}

function getProjectData(setProjectCreator,
                        setProjectManager,
                        setProjectTitle,
                        setProjectDescription,
                        setProjectStatus,
                        setNewRolesList,
                        id) {
    useEffect(() => {
        ProjectService.getProject(id).then(
            response => {
                setProjectCreator(response.data.creator);
                setProjectManager(response.data.projectManager);
                setProjectTitle(response.data.title);
                setProjectDescription(response.data.description);
                setProjectStatus(response.data.status);
                setNewRolesList(response.data.userProjectRoleDto);
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            }
        );
    }, [])
}

function updateProject(projectId, updatedProject, setErrors, setShowSuccessModal) {
    const errorList = validate(updatedProject);
    if(Object.keys(errorList).length>0){
        setErrors(errorList);
        return null;
    }
console.log(updatedProject)
    ProjectService.updateProject(projectId, updatedProject).then(
        response => {
            if(response.data !==null){
                setShowSuccessModal(true);
            }
        }
    )
        .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            }
        );
}