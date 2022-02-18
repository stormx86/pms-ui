import React, {Component} from "react";
import {Routes, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import ProjectList from "./components/project-list.component";
import ProjectDetails from "./components/project-details.component";
import BoardAdmin from "./components/board-admin.component";
import ProjectCreate from "./components/project-create.component";
import ProjectEdit from "./components/project-edit.component";

import EventBus from "./common/EventBus";

class App extends Component {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            showAdminBoard: false,
            currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                showAdminBoard: user.roles.includes("ROLE_ADMIN"),
            });
        }

        EventBus.on("logout", () => {
            this.logOut();
        });
    }

    componentWillUnmount() {
        EventBus.remove("logout");
    }

    logOut() {
        AuthService.logout();
        this.setState({
            showAdminBoard: false,
            currentUser: undefined,
        });
    }

    render() {
        const {currentUser, showAdminBoard} = this.state;

        return (
            <div>
                <Navbar bg="light" variant="primary">
                    <Container>
                        <Navbar.Brand href="/projects">Project Management System</Navbar.Brand>
                        <Nav className="me-auto">
                            {currentUser && (
                                <Nav.Link href="/projects">Project List</Nav.Link>
                            )}

                            {currentUser && (
                                <Nav.Link href="/projects/create">Create project</Nav.Link>
                            )}

                            {showAdminBoard && (
                                <Nav.Link href="/admin">Admin Panel</Nav.Link>
                            )}
                        </Nav>

                        <Navbar.Collapse className="justify-content-end">
                            {currentUser ? (
                                <div className="navbar-nav ml-auto">
                                    <Navbar.Text>
                                        Signed in as: <a href="/profile">{currentUser.username}</a>
                                    </Navbar.Text>
                                    <Nav.Link href="/login" onClick={this.logOut}>Sign Out</Nav.Link>
                                </div>
                            ) : (
                                <Nav><Nav.Link href="/login">Sign In</Nav.Link></Nav>

                            )}
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <div className="container mt-3">
                    <Routes>
                        <Route exact path="/" element={<Login/>}/>
                        <Route exact path="/login" element={<Login/>}/>
                        <Route path="/projects" element={<ProjectList/>}/>
                        <Route path="/projects/project" element={<ProjectDetails/>}/>
                        <Route path="/admin" element={<BoardAdmin/>}/>
                        <Route path="/projects/create" element={<ProjectCreate/>}/>
                        <Route path="/projects/project/edit" element={<ProjectEdit/>}/>
                    </Routes>
                </div>
            </div>
        );
    }
}
export default App;
