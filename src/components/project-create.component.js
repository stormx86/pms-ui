import React, {useEffect, useState} from "react";
import AuthService from "../services/auth-service";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ProjectService from "../services/project-service";
import Alert from "react-bootstrap/Alert";
import validate from "../validators/project-details-validator";
import Modal from "react-bootstrap/Modal";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import getAllUsers from '../common/get-all-users'
import getAllProjectRoleNames from '../common/get-all-project-role-names'


export default function ProjectCreate() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [rolesData, setRolesData] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [newRolesList, setNewRolesList] = useState([]);
    const [projectManagerName, setProjectManagerName] = useState('');
    const [projectBodyData, setProjectBodyData] = useState({title: '', description: ''});
    const [errorMessage, setErrorMessage] = useState({
        projectManagerConstraint: '',
        descriptionMin: '',
        titleMin: '',
        roleErrors: []
    });
    const roleUserInputValidationErrors = errorMessage.roleErrors;

    const handleClose = () => {
        setShowSuccessModal(false);
        window.location.href = '/projects'
    };

    const handleAddRole = () => {
        setNewRolesList([...newRolesList, {projectRoleName: 'Engineer', userName: ''}]);
    };

    const handleRemoveRole = index => {
        const list = [...newRolesList];
        list.splice(index, 1);
        setNewRolesList(list);
        setErrorMessage('');
    };

    const updateSelectedRoles = index => e => {
        let newArr = [...newRolesList];
        newArr[index].projectRoleName = e.target.value;
        setNewRolesList(newArr);
    };

    const updateUsernamesForRoles = index => e => {
        let newArr = [...newRolesList];
        newArr[index].userName = e.currentTarget.textContent;
        setNewRolesList(newArr);
        setErrorMessage('');
    };

    const newProject = {
        title: projectBodyData.title,
        description: projectBodyData.description,
        creator: currentUser,
        projectManager: projectManagerName,
        userProjectRoleDto: newRolesList
    };

    getCurrentUser(setCurrentUser);
    getAllProjectRoleNames(setRolesData);
    getAllUsers(setAllUsers);

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
                                    <Col xs={5}>
                                        Creator:
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Control type="text" value={currentUser} readOnly={1}/>
                                    </Col>
                                    <Col xs={1}>
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row style={{alignItems: 'center'}}>
                                    <Col xs={5}>
                                        Project Manager:
                                    </Col>
                                    <Col xs={6}>
                                        <Autocomplete
                                            onChange={(e) => {
                                                setErrorMessage('');
                                                setProjectManagerName(e.currentTarget.textContent)
                                            }}
                                            freeSolo
                                            options={allUsers.map((option) => option.username)}
                                            renderInput={(params) => <TextField {...params} label="username"
                                                                                size="small"/>}
                                        />
                                        <div>{errorMessage.projectManagerConstraint && (<Alert
                                            variant="danger">{errorMessage.projectManagerConstraint}</Alert>)}</div>
                                    </Col>
                                    <Col xs={1}>
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            {newRolesList &&
                            newRolesList.map((roles, index) => {
                                return (
                                    <ListGroup.Item key={index}>
                                        <Row style={{alignItems: 'center'}}>
                                            <Col xs={5}>
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
                                                <Autocomplete
                                                    onChange={updateUsernamesForRoles(index)}
                                                    freeSolo
                                                    options={allUsers.map((option) => option.username)}
                                                    renderInput={(params) => <TextField {...params} label="username"
                                                                                        size="small"/>}
                                                />{' '}
                                                {roleUserInputValidationErrors && roleUserInputValidationErrors.includes(roles.userName) && (
                                                    <Alert variant="danger">User not found</Alert>)}
                                            </Col>
                                            <Col xs={1}>
                                                <FontAwesomeIcon style={{cursor: 'pointer', fontSize: '18px'}}
                                                                 icon={faTrash} onClick={() => {
                                                    handleRemoveRole(index)
                                                }}/>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                );
                            })}
                            <Button size="sm" variant="secondary" onClick={handleAddRole}>Add new role</Button>
                        </ListGroup>
                    </Card>
                    <br/>
                    <Button variant="success" onClick={() => {
                        createProject(newProject, setErrorMessage, setShowSuccessModal)
                    }}>Create</Button>{' '}
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
                                              value={projectBodyData.title} onChange={e => {
                                    setErrorMessage('');
                                    setProjectBodyData({
                                        title: e.target.value,
                                        description: projectBodyData.description
                                    })
                                }}/>
                                <div>{errorMessage.titleMin && (<Alert
                                    variant="danger">{errorMessage.titleMin}</Alert>)}</div>
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
                                <Form.Control as="textarea" rows={8} placeholder="Put project description here..."
                                              value={projectBodyData.description} onChange={e => {
                                    setErrorMessage('');
                                    setProjectBodyData({title: projectBodyData.title, description: e.target.value})
                                }}/>
                                <div>{errorMessage.descriptionMin && (<Alert
                                    variant="danger">{errorMessage.descriptionMin}</Alert>)}</div>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showSuccessModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>!!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>New project has been successfully created</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

function getCurrentUser(setCurrentUser) {
    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user.username);
        }
    }, [])
}

function createProject(newProject, setErrorMessage, setShowSuccessModal) {
    ProjectService.createProject(newProject).then(
        response => {
            if (response.data !== null) {
                setShowSuccessModal(true);
            }
        }
    )
        .catch((error) => {
                if (error.response) {
                    const errorList = validate(error.response);
                    setErrorMessage(errorList);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            }
        );
}