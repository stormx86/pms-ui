import React, {useEffect, useMemo, useState} from "react";
import "../css/admin.css";
import Nav from "react-bootstrap/Nav";
import BTable from "react-bootstrap/Table";
import {usePagination, useTable} from "react-table";
import AdminService from "../services/admin.service";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

export default function BoardAdminUserManagement() {

    const [data, setData] = useState([]);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [currentlyEditedUser, setCurrentlyEditedUser] = useState({userId: '', username: ''});
    const [userRoleChecked, setUserRoleChecked] = useState(false);
    const [adminRoleChecked, setAdminRoleChecked] = useState(false);
    const [newUser, setNewUser] = useState({username: ''});
    const [newUserUserRoleChecked, setNewUserUserRoleChecked] = useState(false);
    const [newUserAdminRoleChecked, setNewUserAdminRoleChecked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    getData(setData);

    const handleClose = () => {
        setUserRoleChecked(false);
        setAdminRoleChecked(false);
        setShowEditUserModal(false);
    };

    const handleUserRoleCheck = (e) => {
        setUserRoleChecked(e.target.checked);
    };

    const handleAdminRoleCheck = (e) => {
        setAdminRoleChecked(e.target.checked);
    };

    const handleNewUserUserRoleCheck = (e) => {
        setNewUserUserRoleChecked(e.target.checked);
    };

    const handleNewUserAdminRoleCheck = (e) => {
        setNewUserAdminRoleChecked(e.target.checked);
    };

    const handleSaveRoles = (handlingUser,
                             userRoleChecked,
                             adminRoleChecked,
                             setData,
                             setErrorMessage,
                             isNewUser) => {
        const user = {
            userId: handlingUser.userId,
            username: handlingUser.username,
            globalRoles: []
        };
        userRoleChecked && user.globalRoles.push('ROLE_USER');
        adminRoleChecked && user.globalRoles.push('ROLE_ADMIN');

        if (isNewUser) {
            addNewUser(user, setData, setErrorMessage);
            setNewUser({username: ''});
            setNewUserUserRoleChecked(false);
            setNewUserAdminRoleChecked(false);
        } else {
            updateUserRoles(user, setData);
            handleClose();
        }
    };

    const handleRolesView = (value) => {
        if (value.value[0] === 'ROLE_USER' && value.value[1] === 'ROLE_ADMIN') return 'User, Admin';
        if (value.value[0] === 'ROLE_ADMIN' && value.value[1] === 'ROLE_USER') return 'User, Admin';
        if (value.value[0] === 'ROLE_USER') return 'User';
        if (value.value[0] === 'ROLE_ADMIN') return 'Admin';
    };

    const columns = useMemo(
        () => [
            {
                Header: 'User ID',
                accessor: 'userId',
                width: '10%',
                Cell: row => (
                    <div style={{ textAlign: 'center' }}>
                        {row.value}
                    </div>
                )
            },
            {
                Header: 'User Name',
                accessor: 'username',
            },
            {
                Header: 'Roles',
                accessor: 'globalRoles',
                width: '20%',
                Cell: (cell) => (
                    <div>
                        {handleRolesView(cell.row.cells[2])}
                    </div>
                )
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: {pageIndex, pageSize},
    } = useTable(
        {
            columns,
            data,
            initialState: {pageIndex: 0, pageSize: 10},
        },
        usePagination);

    return (
        <>
            <Nav variant="tabs" defaultActiveKey="/admin/user">
                <Nav.Item>
                    <Nav.Link href="/admin/user">UserManagement</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/admin/role">RoleManagement</Nav.Link>
                </Nav.Item>
            </Nav>
            <br/>
            <Container fluid="true">
                <Row>
                    <Col xs={4}>
                        <Card>
                            <Card.Header className="add-new-user-header">Add new user:</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            placeholder="Username"
                                            aria-label="Username"
                                            aria-describedby="basic-addon2"
                                            value={newUser.username}
                                            onChange={e => {
                                                setNewUser({username: e.target.value})
                                                setErrorMessage('')
                                            }
                                            }
                                        />
                                        <Button variant="outline-secondary" id="button-addon2" onClick={() => {
                                            handleSaveRoles(
                                                newUser,
                                                newUserUserRoleChecked,
                                                newUserAdminRoleChecked,
                                                setData,
                                                setErrorMessage,
                                                true)
                                        }}>
                                            Submit
                                        </Button>
                                    </InputGroup>
                                    <br/>
                                    <div style={{marginTop:'-16px'}}>{errorMessage && (<Alert variant="danger">{errorMessage}</Alert>)}</div>
                                    <Form.Check
                                        className='form-check'
                                        type='checkbox'
                                        label='USER'
                                        checked={newUserUserRoleChecked}
                                        onChange={(e) => {
                                            handleNewUserUserRoleCheck(e)
                                        }}
                                    />
                                    <Form.Check
                                        className='form-check'
                                        type='checkbox'
                                        label='ADMIN'
                                        checked={newUserAdminRoleChecked}
                                        onChange={(e) => {
                                            handleNewUserAdminRoleCheck(e)
                                        }}
                                    />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <br/>

            <BTable bordered hover {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th style={{width: column.width}}
                                key={column.id} {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr key={row.id} {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td
                                    onClick={() => {
                                        setShowEditUserModal(true);
                                        setCurrentlyEditedUser({
                                            userId: row.original.userId,
                                            username: row.original.username,
                                        });
                                        row.original.globalRoles.map(role => {
                                            if (role === 'ROLE_USER') {
                                                setUserRoleChecked(true)
                                            }
                                            if (role === 'ROLE_ADMIN') {
                                                setAdminRoleChecked(true)
                                            }

                                        });

                                    }}
                                    key={cell.row} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </BTable>

            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>
                {' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>
                {' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>
                {' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>
                {' '}
                <span>
                                                Page{' '}
                    <strong>
                                                {pageIndex + 1} of {pageOptions.length}
                                                </strong>{' '}
                                                </span>
                <span>
                                                | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{width: '100px'}}
                    />
                                                </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <br/>

            <Modal size="lg"
                   aria-labelledby="contained-modal-title-vcenter"
                   centered
                   show={showEditUserModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="edit-user-header">Edit User - {currentlyEditedUser.username}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <div className="roles-header">
                                    Roles:
                                </div>
                                <Form>
                                    <Form.Check
                                        className='form-check'
                                        type='checkbox'
                                        id='user'
                                        label='USER'
                                        checked={userRoleChecked}
                                        onChange={(e) => {
                                            handleUserRoleCheck(e)
                                        }}
                                    />
                                    <Form.Check
                                        className='form-check'
                                        type='checkbox'
                                        id='admin'
                                        label='ADMIN'
                                        checked={adminRoleChecked}
                                        onChange={(e) => {
                                            handleAdminRoleCheck(e)
                                        }}
                                    />
                                </Form>
                            </Col>

                            <Col>
                                <div className="roles-header">
                                    Delete User:
                                </div>
                                <Button variant="danger" onClick={() => deleteUser(
                                    currentlyEditedUser,
                                    setData,
                                    setShowEditUserModal)}>
                                    DELETE
                                </Button>
                            </Col>

                            <Col>
                                <div className="roles-header">
                                    Reset Password:
                                </div>
                                <Button variant="danger" onClick={() => resetUserPassword(
                                    currentlyEditedUser,
                                    setShowEditUserModal)}>
                                    RESET
                                </Button>
                            </Col>
                        </Row>
                    </Container>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => handleSaveRoles(
                        currentlyEditedUser,
                        userRoleChecked,
                        adminRoleChecked,
                        setData,
                        setErrorMessage,
                        false)}>
                        Save
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function resetUserPassword(currentlyEditedUser, setShowEditUserModal) {
    AdminService.resetUserPassword(currentlyEditedUser).then(
        () => {
            setShowEditUserModal(false);
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

function deleteUser(currentlyEditedUser, setData, setShowEditUserModal) {
    AdminService.deleteUser(currentlyEditedUser).then(
        response => {
            setData(response.data);
            setShowEditUserModal(false);
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

function addNewUser(newUser, setData, setErrorMessage) {
    AdminService.addNewUser(newUser).then(
        response => {
            setData(response.data);
        }
    )
        .catch((error) => {
                if (error.response) {
                    const errorsData = error.response.data.errors;
                    errorsData.map(err => {
                            setErrorMessage(err.defaultMessage);
                    })
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            }
        );
}

function getData(setUsersData) {
    useEffect(() => {
        AdminService.getAllUsers().then(
            response => {
                setUsersData(response.data);
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

function updateUserRoles(updatedUser, setData) {
    AdminService.updateUserRoles(updatedUser).then(
        response => {
            setData(response.data);
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
