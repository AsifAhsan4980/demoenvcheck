import * as React from 'react';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import {visuallyHidden} from '@mui/utils';
import table from '../../utils/TableContent';
import {useEffect, useState} from "react";
import UpdateData from "./UpdateData";
import {Grid, MenuItem, TextField} from "@mui/material";
import AddProduct from "./AddProduct";
import DeleteProducts from "./DeleteProducts";
import Pagination from '@mui/material/Pagination';
import {isAuthenticated} from "../../utils/auth";

interface Data {
    product_name: string;
    unit_price: number;
    status: boolean;
    category_name: string;
    available_since: string;
    category_id: number;
    _id: string
}

type Order = 'asc' | 'desc';


interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

export const rowOption = [
    {
        label : 5
    },
    {
        label : 10
    },
    {
        label : 15
    },
]

const headCells: readonly HeadCell[] = [
    {
        id: 'product_name',
        numeric: false,
        disablePadding: true,
        label: 'Product Name',
    },
    {
        id: 'category_id',
        numeric: true,
        disablePadding: false,
        label: 'Category ID',
    },
    {
        id: 'category_name',
        numeric: true,
        disablePadding: false,
        label: 'Category Name',
    },
    {
        id: 'unit_price',
        numeric: true,
        disablePadding: false,
        label: 'Unit Price',
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Status',
    }, {
        id: 'available_since',
        numeric: true,
        disablePadding: false,
        label: 'Available Since',
    }
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const {onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} =
        props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const {numSelected} = props;

    return (
        <Toolbar
            sx={{
                pl: {sm: 2},
                pr: {xs: 1, sm: 1},
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{flex: '1 1 100%'}}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    All Products
                </Typography>
            )}
            <Tooltip title="Filter list">
                <IconButton>
                    <FilterListIcon/>
                </IconButton>
            </Tooltip>

        </Toolbar>
    );
}

export default function EnhancedTable(props: {
    data: any | [],
    limit: number,
    updateFrom: any,
    total: number
}) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('unit_price');
    const [selected, setSelected] = React.useState<any>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(props.limit);
    const [rows, setRows] = React.useState(props.data);
    const [updateProduct, setUpdateProduct] = useState(false)
    const [updateData, setUpdateData] = useState<Data>({
        _id: "",
        available_since: "",
        category_id: 0,
        category_name: "",
        product_name: "",
        status: false,
        unit_price: 0
    })

    useEffect(() => {
        setRows(props.data)
    }, [props.data])

    useEffect(() => {

        props.updateFrom(rowsPerPage)
    }, [rowsPerPage, page])

    const updateState = (f: boolean) => {
        setUpdateProduct(f)
    }



    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n: any) => n._id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    const handleUpdate = (row: any) => {
        setUpdateData(row)
        setUpdateProduct(true)
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            table.stableSort(rows, table.getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [rows, order, orderBy, page, rowsPerPage],
    );

    return (

        <Box sx={{width: '100%'}}>
            <Paper sx={{width: '100%', mb: 2}}>
                <EnhancedTableToolbar numSelected={selected.length}/>
                <TableContainer>
                    <Table
                        sx={{minWidth: 750}}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row: any, index: number) => {
                                const isItemSelected = isSelected(row._id);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event: React.MouseEvent<unknown, MouseEvent>) => isAuthenticated() && selected.length===0 && handleUpdate(row)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row._id}
                                        selected={isItemSelected}
                                        sx={{cursor: 'pointer'}}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                onClick={(event: React.MouseEvent<unknown, MouseEvent>) => handleClick(event, row._id)}
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            {row.product_name}
                                        </TableCell>
                                        <TableCell align="right">{row.category_id}</TableCell>
                                        <TableCell align="right">{row.category_name}</TableCell>
                                        <TableCell align="right">{row.unit_price}</TableCell>
                                        <TableCell
                                            align="right">{row.status ? "Available" : "Not available"}</TableCell>
                                        <TableCell align="right">{row.available_since}</TableCell>

                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/*<TablePagination*/}
                {/*    rowsPerPageOptions={[5, 10, 25]}*/}
                {/*    component="div"*/}
                {/*    count={props.total}*/}
                {/*    rowsPerPage={rowsPerPage}*/}
                {/*    page={page}*/}
                {/*    onPageChange={handleChangePage}*/}
                {/*    onRowsPerPageChange={handleChangeRowsPerPage}*/}
                {/*/>*/}

                <Box sx={{display: 'flex', justifyContent: 'space-evenly', p:2}}>
                    <Pagination showFirstButton
                                showLastButton count={props.total} onChange={handleChangePage} page={page} defaultPage={1}
                                variant="outlined" shape="rounded"/>
                    <Box sx={{display: 'flex', justifyContent: 'space-evenly'}}>
                        <Typography sx={{p:1}}>
                            Row per page
                        </Typography>
                        <TextField
                            size={"small"}
                            id="outlined-select-currency"
                            select
                            sx={{pr: 1}}
                            onChange={handleChangeRowsPerPage}
                            defaultValue={5}
                        >
                            {rowOption.map((option) => (
                                <MenuItem key={option.label} value={option.label}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>



                </Box>

            </Paper>
            <Grid container spacing={2}>
                <Grid item>
                    <AddProduct/>
                </Grid>
                <Grid item>
                    <DeleteProducts productIDs={selected}/>
                </Grid>
            </Grid>
            {updateProduct && <UpdateData data={updateData} flag={updateProduct} updateState={updateState}/>}
        </Box>
    );
}