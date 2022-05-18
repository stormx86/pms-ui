import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "../css/admin.css";
import UserService from "../services/user-service";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import validate from "../validators/user-profile-validator";

export default function Profile() {
    const [data, setData] = useState('');
    const {userId} = useParams();
    const [errorMessage, setErrorMessage] = useState({
        commonMessage: '',
        newPasswordMessage: '',
        repeatPasswordMessage: ''
    });
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    getData(userId, setData, setErrorMessage);

    return (
        <>
            <Container fluid="true">
                <Row>
                    <Col>
                        <Card>
                            <Card.Header className="add-new-user-header">{data.username}&#39;s Profile</Card.Header>
                            <Card.Body>
                                <Card.Title>Change password</Card.Title>
                                <Card.Text>
                                    <Row>
                                        <Col xs={2}>
                                            <Form.Label style={{marginRight: '10px', marginTop: '5px'}}>New password: </Form.Label>
                                        </Col>

                                        <Col xs={3}>
                                            <Form.Control type="password"
                                                          placeholder="New password"
                                                          value={newPassword}
                                                          onChange={e => {
                                                              setNewPassword(e.target.value)
                                                              setErrorMessage('')
                                                          }}/>

                                            <div>{errorMessage.newPasswordMessage && (<Alert
                                                    variant="danger">{errorMessage.newPasswordMessage}</Alert>)}</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={2}>
                                            <Form.Label style={{marginRight: '10px', marginTop: '5px'}}>Confirm password:</Form.Label>
                                        </Col>

                                        <Col xs={3}>

                                            <Form.Control type="password"
                                                          placeholder="Confirm new password"
                                                          value={repeatPassword}
                                                          onChange={e => {
                                                              setRepeatPassword(e.target.value)
                                                              setErrorMessage('')
                                                          }}/>

                                            <div>{errorMessage.repeatPasswordMessage && (
                                                <Alert variant="danger">{errorMessage.repeatPasswordMessage}</Alert>)}</div>
                                            <div>{errorMessage.commonMessage && (
                                                <Alert variant="danger">{errorMessage.commonMessage}</Alert>)}</div>
                                        </Col>
                                    </Row>
                                    <Button variant="outline-secondary" onClick={() => {
                                        changePassword(
                                            data,
                                            newPassword,
                                            repeatPassword,
                                            errorMessage,
                                            setErrorMessage,
                                            setData)
                                    }}>
                                        Submit
                                    </Button>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

function changePassword(data, newPassword, repeatPassword, errorMessage, setErrorMessage, setData) {
        const user = {
            userId: data.userId,
            password: newPassword,
            repeatPassword: repeatPassword
        };
        UserService.changePassword(user).then(
            response => {
                setErrorMessage({commonMessage: 'Password successfully changed'})
                setData(response.data);
            }
        )
            .catch((error) => {
                    if (error.response) {
                       const errorList =  validate(error.response);
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

function getData(userId, setData, setErrorMessage) {
    useEffect(() => {
        UserService.getUserProfile(userId).then(
            response => {
                setData(response.data);
            })
            .catch((error) => {
                    if (error.response.data) {
                        const errorsData = error.response.data;
                        setErrorMessage({commonMessage: errorsData.message,});

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