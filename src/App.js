import React, {Component} from "react";
import {Routes, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import ProjectList from "./components/project-list.component";
import ProjectDetails from "./components/project-details.component";
import BoardAdminUserManagement from "./components/board-admin-user-management.component";
import BoardAdminRoleManagement from "./components/board-admin-role-management.component";
import ProjectCreate from "./components/project-create.component";
import ProjectEdit from "./components/project-edit.component";
import Profile from "./components/profile.component";
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
                <Container>
                <Navbar >
                    <Container>
                        <Navbar.Brand className="nav-brand" href="/projects">ProjectManagementSystem</Navbar.Brand>
                        <Nav className="me-auto">
                            {currentUser && (
                                <Nav.Link className="nav-link" href="/projects">ProjectList</Nav.Link>
                            )}

                            {currentUser && (
                                <Nav.Link className="nav-link" href="/projects/create">CreateProject</Nav.Link>
                            )}

                            {showAdminBoard && (
                                <Nav.Link className="nav-link" href="/admin/user">AdminPanel</Nav.Link>
                            )}
                        </Nav>

                        <Navbar.Collapse className="justify-content-end">
                            {currentUser && (
                                <div className="navbar-nav ml-auto">
                                    <Navbar.Text className="navbar-text">
                                        Signed in as: <a href={'../profile/' + currentUser.id}>{currentUser.username}</a>
                                    </Navbar.Text>
                                    <Nav.Link href="/login" onClick={this.logOut}>SignOut</Nav.Link>
                                </div>
                            )}
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                </Container>
                <div className="container mt-3">
                    <Routes>
                        <Route exact path="/" element={<Login/>}/>
                        <Route exact path="/login" element={<Login/>}/>
                        <Route path="/projects" element={<ProjectList/>}/>
                        <Route path="/projects/project" element={<ProjectDetails/>}/>
                        <Route path="/admin/user" element={<BoardAdminUserManagement/>}/>
                        <Route path="/admin/role" element={<BoardAdminRoleManagement/>}/>
                        <Route path="/projects/create" element={<ProjectCreate/>}/>
                        <Route path="/projects/project/edit" element={<ProjectEdit/>}/>
                        <Route path="/profile/:userId" element={<Profile/>}/>
                    </Routes>
                </div>
            </div>
        );
    }
}

export default App;
