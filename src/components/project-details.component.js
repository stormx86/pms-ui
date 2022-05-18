import React, {useState, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/project-details.css";
import ProjectService from "../services/project.service";
import StatusService from "../services/status.service";
import CommentService from "../services/comment.service";
import EventBus from "../common/EventBus";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import AuthService from "../services/auth.service";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faMinus, faTrash} from '@fortawesome/free-solid-svg-icons'


export default function ProjectDetails() {
    const currentUser = AuthService.getCurrentUser();
    const [projectData, setProjectData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [showAdminBoard, setShowAdminBoard] = useState(currentUser.roles.includes("ROLE_ADMIN"));
    const [searchParams] = useSearchParams();
    const [newComment, setNewComment] = useState({projectId: '', commentText: '', username: '', createdAt: ''});
    const [showNewCommentForm, setShowNewCommentForm] = useState(false);

    const projectId = searchParams.get('projectId');

    getProjectData(setProjectData, projectId);
    getStatusData(setStatusData);

    const [currentProjectStatus, setCurrentProjectStatus] = useState();

    useEffect(() => {
        setCurrentProjectStatus(projectData.status);
    }, [projectData.status]);

    const handleStatusChange = (event) => {
        setCurrentProjectStatus(event.target.value);
    };

    return (
        <Container>
            <Row>
                <Col xs={3}>
                    <Card border="secondary" style={{width: '18rem'}}>
                        <Card.Header className="card-header">
                            <Card.Title className="card-title">
                                Project Members
                            </Card.Title>
                        </Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Creator: {projectData.creator}</ListGroup.Item>
                            <ListGroup.Item>Project Manager: {projectData.projectManager}</ListGroup.Item>

                            {projectData.userProjectRoleDto &&
                            projectData.userProjectRoleDto.map((userProjectRole) => {

                                return (
                                    <ListGroup.Item
                                        key={userProjectRole.userProjectRoleId}>{userProjectRole.projectRoleName}: {userProjectRole.userName}</ListGroup.Item>
                                );
                            })}

                        </ListGroup>
                    </Card>
                    <br/>
                    <Card border="secondary" style={{width: '18rem'}}>
                        <Card.Header>
                            <Card.Title>
                                Project Status
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <Form.Select value={currentProjectStatus} onChange={handleStatusChange}>
                                    {statusData &&
                                    statusData.map((status) => {

                                        return (
                                            <option key={status.code}
                                                    value={status.statusName}>{status.statusName}</option>
                                        );
                                    })}

                                </Form.Select>
                                <br/>

                                <Button variant="outline-success" size="sm" onClick={() => {
                                    setNewProjectStatus(currentProjectStatus, projectData.projectId)
                                }}>Apply</Button>


                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <br/>
                    <Button variant="outline-danger" size="sm"
                            onClick={() => window.location.href = '/projects/project/edit?projectId=' + projectData.projectId}>Edit
                        Project</Button>{' '}
                    {showAdminBoard && <Button variant="outline-danger" size="sm" onClick={() => {
                        deleteProject(projectId)
                    }}>Delete Project</Button>}
                </Col>
                <Col xs={7}>
                    <Card border="secondary" style={{width: '60rem'}}>
                        <Card.Header>
                            <Card.Title>
                                <Container fluid="true">
                                    <Row>
                                        <Col xs={9}>
                                            {projectData.title}
                                        </Col>
                                        <Col xs={3} className="d-flex justify-content-end">
                                            <div style={{fontSize: '17px'}}>{projectData.createdAt}</div>

                                        </Col>
                                    </Row>
                                </Container>
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                {projectData.description}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <br/>
                    <Card border="secondary" style={{width: '60rem'}}>
                        <Card.Header>
                            <Card.Title>
                                <Container fluid="true">
                                    <Row>
                                        <Col xs={10}>
                                            Comments
                                        </Col>
                                        <Col xs={2}>
                                            <FontAwesomeIcon style={{cursor: 'pointer', fontSize: '25px'}}
                                                             icon={!showNewCommentForm ? faPlus : faMinus}
                                                             onClick={() => {
                                                                 !showNewCommentForm ? setShowNewCommentForm(true) : setShowNewCommentForm(false)
                                                             }}/>
                                        </Col>
                                    </Row>
                                </Container>
                            </Card.Title>
                        </Card.Header>
                        <ListGroup variant="flush">
                            {projectData.comments &&
                            projectData.comments.map((comment) => {

                                return (
                                    <ListGroup.Item key={comment.commentId}>
                                        <Container fluid="true">
                                            <Row>
                                                <Col xs={8}>
                                                    <b>{comment.username}</b>
                                                </Col>
                                                <Col xs={3} className="d-flex justify-content-end">
                                                    {comment.createdAt}
                                                </Col>
                                                <Col xs={1}>
                                                    {showAdminBoard &&
                                                    <FontAwesomeIcon style={{cursor: 'pointer', fontSize: '18px'}}
                                                                     icon={faTrash} onClick={() => {
                                                        handleDeleteComment(
                                                            comment.commentId,
                                                            setProjectData,
                                                            projectId)
                                                    }}/>}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={9}>
                                                    <div>{comment.commentText}</div>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </ListGroup.Item>
                                );
                            })}

                            {projectData.comments < 1 && (
                                <div><i>There are no comments yet...</i></div>
                            )}
                        </ListGroup>
                    </Card>

                    {showNewCommentForm && <Card border="secondary" style={{width: '60rem'}}>
                        <Card.Body>
                            <Form.Control as="textarea" rows={4} value={newComment.commentText}
                                          placeholder="Put your comment here..."
                                          onChange={e => {
                                              setNewComment({
                                                  projectId: projectId,
                                                  commentText: e.target.value,
                                                  username: currentUser.username
                                              })
                                          }}/>
                            <br/>
                            <Button variant="success" size="sm"
                                    onClick={() => {
                                        handleAddComment(newComment, setProjectData, projectId, setNewComment);
                                    }}>Submit</Button>
                        </Card.Body>
                    </Card>
                    }
                </Col>
            </Row>
        </Container>
    )
}

function handleDeleteComment(commentId, setProjectData, projectId) {
    CommentService.deleteComment(commentId).then(() => {
            ProjectService.getProject(projectId).then(
                response => {
                    setProjectData(response.data)
                })
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
        });
}


function handleAddComment(newComment,
                          setProjectData,
                          projectId,
                          setNewComment) {

    CommentService.addNewComment(newComment).then(() => {
            ProjectService.getProject(projectId).then(
                response => {
                    setProjectData(response.data);
                    setNewComment({commentText: ''});
                })
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
        });

}

function getProjectData(setProjectData, id) {
    useEffect(() => {
        ProjectService.getProject(id).then(
            response => {
                setProjectData(response.data);
            },
            error => {
                setProjectData(
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

function deleteProject(id) {
    ProjectService.deleteProject(id).then(() => {
            window.location.href = '/projects'
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

function getStatusData(setStatusData) {
    useEffect(() => {
        StatusService.getAllStatuses().then(
            response => {
                setStatusData(response.data);
            },
            error => {
                setStatusData(
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

function setNewProjectStatus(newStatus, projectId) {
    StatusService.setNewProjectStatus(newStatus, projectId).then(
        error => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("logout");
            }
        }
    );
}