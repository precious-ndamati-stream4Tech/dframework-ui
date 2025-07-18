import {
    GridFooterContainer,
    GridFooter
} from '@mui/x-data-grid-premium';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../useRouter/StateProvider';
const Footer = ({ pagination, apiRef, tTranslate = (key) => key }) => {
    const page = apiRef.current.state.pagination.paginationModel.page;
    const rowsPerPage = apiRef.current.state.pagination.paginationModel.pageSize;
    const totalRows = apiRef.current.state.rows.totalRowCount;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const { t: translate, i18n } = useTranslation()
    const tOpts = { t: translate, i18n };
    const [pageNumber, setPageNumber] = useState(page + 1);
    const { useLocalization } = useStateContext();
    const { getLocalizedString } = useLocalization();

    const handleChange = function (e) {
        let value = e.target?.value;

        if (value === '') {
            setPageNumber('');
        } else {
            value = parseInt(value);
            value = isNaN(value) || value < 1 ? 1 : value;
            setPageNumber(value);
        }
    }

    useEffect(() => {
        setPageNumber(page + 1);
    }, [page, rowsPerPage]);

    const onPageChange = function () {
        let targetPage = pageNumber === '' ? 1 : pageNumber;
        targetPage = Math.max(targetPage, 1);
        targetPage = Math.min(targetPage, totalPages);
        apiRef.current.setPage(targetPage - 1);
        setPageNumber(targetPage);
        if (pageNumber === '') {
            setPageNumber(1);
        }
    }
    const handleKeyPress = (event) => {
        const keyCode = event.which || event.keyCode;
        const keyValue = String.fromCharCode(keyCode);
        if (!/\d/.test(keyValue)) event.preventDefault();
    }

    return (
        <GridFooterContainer>
            <Box sx={{ pl: 5 }}>
                {pagination &&
                    <>
                        <Typography variant="p">{tTranslate('Jump to page', tOpts)}:</Typography>
                        <TextField
                            sx={{
                                width: 70,
                                pl: 1,
                                '& input[type=number]::-webkit-inner-spin-button': {
                                    cursor: 'pointer'
                                },
                                '& input[type=number]::-webkit-outer-spin-button': {
                                    cursor: 'pointer'
                                }
                            }}
                            variant="standard"
                            type='number'
                            min={1}
                            value={pageNumber}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            disabled={!totalRows}
                        />
                        <Button disabled={!totalRows} size='small' onClick={onPageChange}>{tTranslate('Go', tOpts)}</Button>
                    </>
                }
            </Box>
            <GridFooter />
        </GridFooterContainer>
    );
}
export { Footer };