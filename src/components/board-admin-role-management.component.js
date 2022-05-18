import React, {useEffect, useMemo, useState} from "react";
import {usePagination, useTable} from "react-table";
import "../css/admin.css";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import BTable from "react-bootstrap/Table";
import AdminService from "../services/admin-service";
import ProjectService from "../services/project-service";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

export default function BoardAdminRoleManagement() {

    const [data, setData] = useState([]);
    const [newProjectRole, setNewProjectRole] = useState({roleName: ''});
    const [errorMessage, setErrorMessage] = useState('');

    getData(setData);

    const columns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'projectRoleId',
                width: '10%',
                Cell: row => (
                    <div style={{ textAlign: 'center' }}>
                        {row.value}
                    </div>
                )
            },
            {
                Header: 'Project Role Name',
                accessor: 'roleName',
            },
            {
                Header: '',
                accessor: 'del',
                width: '10%',
                Cell: (cell) => (
                    <div style={{ textAlign: 'center' }}>
                    <FontAwesomeIcon style={{cursor: 'pointer', fontSize: '20px'}}
                                     icon={faTrash}
                                     onClick={() => {
                                         deleteProjectRole(cell.row.cells[0].value, setData)
                                     }}/>
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
            <Nav variant="tabs" defaultActiveKey="/admin/role">
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
                            <Card.Header className="add-new-user-header">Add new project role:</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            placeholder="Role name"
                                            aria-label="Role name"
                                            aria-describedby="basic-addon2"
                                            value={newProjectRole.roleName}
                                            onChange={e => {
                                                setNewProjectRole({roleName: e.target.value})
                                                setErrorMessage('')
                                            }
                                            }
                                        />
                                        <Button variant="outline-secondary" id="button-addon2" onClick={() => {
                                            addNewProjectRole(
                                                newProjectRole,
                                                setData,
                                                setErrorMessage)
                                        }}>
                                            Submit
                                        </Button>
                                    </InputGroup>
                                    <div style={{marginTop: '-16px'}}>{errorMessage && (
                                        <Alert variant="danger">{errorMessage}</Alert>)}</div>
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
                        <tr style={{cursor: 'default'}} key={row.id} {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td key={cell.row} {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
        </>
    );
}

function addNewProjectRole(newProjectRole, setData, setErrorMessage) {
    AdminService.addNewProjectRole(newProjectRole).then(
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

function getData(setData) {
    useEffect(() => {
        ProjectService.getAllProjectRoleNames().then(
            response => {
                setData(response.data);
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

function deleteProjectRole(projectRoleId, setData) {
    AdminService.deleteProjectRole(projectRoleId).then(
        response => {
            setData(response.data);
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
}
