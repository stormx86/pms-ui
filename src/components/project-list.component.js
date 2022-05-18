import React, {useState, useEffect, useMemo} from "react";
import {useTable, usePagination} from 'react-table'
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/project-list.css";

import BTable from 'react-bootstrap/Table';
import ProjectService from "../services/project.service";
import EventBus from "../common/EventBus";


export default function ProjectList() {
    const [data, setData] = useState([]);

    getData(setData);

    const columns = useMemo(
        () => [
            {
                Header: 'Project #',
                accessor: 'projectId',
                width: '10%',
            },
            {
                Header: 'Created At',
                accessor: 'createdAt',
                width: '15%',
            },
            {
                Header: 'Project Name',
                accessor: 'title',
            },
            {
                Header: 'Status',
                accessor: 'status',
                width: '15%',
            },
            {
                Header: 'Project Manager',
                accessor: 'projectManager',
                width: '15%',
            },
            {
                Header: 'Creator',
                accessor: 'creator',
                width: '10%',
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
            initialState: {pageIndex: 0, pageSize: 20},
        },
        usePagination);

    return (
        <>

            <BTable bordered hover {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th style={{width: column.width}} key={column.id} {...column.getHeaderProps()}>{column.render('Header')}</th>
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
                                return <td onClick={()=> window.location.href = '/projects/project?projectId='+row.values.projectId} key={cell.row} {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
    )
}

function getData(setData) {
    useEffect(() => {
        ProjectService.getAllProjects().then(
            response => {
                setData(response.data);
            },
            error => {
                setData(
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