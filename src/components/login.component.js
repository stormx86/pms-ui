import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Button from 'react-bootstrap/Button';
import "../css/login.css";

import AuthService from "../services/auth-service";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            username: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    handleLogin(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.login(this.state.username, this.state.password).then(
                () => {
                    window.location.href = '/projects';
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
            );
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        return (
            <div className="login-form">
                <Form onSubmit={this.handleLogin} ref={c => {
                    this.form = c;
                }}>
                    <h4>Project Management System</h4>
                    <p align="center">Sign In Please</p>
                    <div className="form-group">
                        <Input type="text" className="form-control" name="username" placeholder="Username"
                               value={this.state.username}
                               onChange={this.onChangeUsername}
                               validations={[required]}/>
                    </div>
                    <div className="form-group">
                        <Input type="password" className="form-control" name="password" placeholder="Password"
                               value={this.state.password}
                               onChange={this.onChangePassword}
                               validations={[required]}/>
                        <br/>
                    </div>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary" size="lg" type="submit" disabled={this.state.loading}>Sign in</Button>
                  </div>
                    {this.state.message && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                                {this.state.message}
                            </div>
                        </div>
                    )}
                    <CheckButton
                        style={{display: "none"}}
                        ref={c => {
                            this.checkBtn = c;
                        }}/>
                </Form>
            </div>
        );
    }
}