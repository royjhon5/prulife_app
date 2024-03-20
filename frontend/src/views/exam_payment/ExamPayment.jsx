import { Box, Button, Card, CardContent, Checkbox, Chip, Container, Fade, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Grow, IconButton, TextField, Typography } from "@mui/material"
import Header from "../../components/Header/Header";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import http from "../../api/http";
import toast from "react-hot-toast";
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, GridToolbar, gridClasses  } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NoDataFound from "../../components/NoDataFound/NoDataFound";
import DataLoading from "../../components/DataGridLoading/DataLoading";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const ExamPayment = () => {
    const grow = true;
    const [bybDate, setBybDate] = useState(null);
    const [recruitList, setRecruitList] = useState([]);
    const [search, setSearch] = useState('');
    const [loadingData, setLoadingData] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [showUpdatedMessage, setShowUpdatedMessage] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [updatedRowId, setUpdatedRowId] = useState(null);
    const [recruitID, setRecruitID] = useState(0);

    console.log(recruitList)
    useEffect(() => {
        fetchRecruitList();
    }, [])

    const fetchRecruitList = async () => {
        setLoadingData(true)
        try {
            const result = await http.get('/exam-payment');
            const resultData = result.data;
            setRecruitList(resultData);
            setLoadingData(false)
        } catch (err) {
            toast.error('Error fetching data', err)
        }
    }

    const setBybDateHere = (newDate) => {
        const formattedDate = dayjs(newDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        setBybDate(formattedDate);
    };

    async function DeleteData(id) {
        setDeleteLoading(true)
        try {
            await http.delete(`/exam-payment?id=${id}`);
            toast.success("Data has been deleted.");
            setDeleteLoading(false)
            fetchRecruitList();
        } catch(err) {
            toast.error(err)
        }
    }
  return (
    <Container maxWidth="xxl" sx={{ paddingTop: '55px'}}>
        <Grid container columnSpacing={2} rowSpacing={2}>
            <Grow in={grow} style={{ transformOrigin: '0 0 0' }}{...(grow ? { timeout: 600 } : {})}>
                <Grid item xs={12} md={12} lg={12}>
                    <Header title="Exam Payment Entry" />
                </Grid>
            </Grow>
            <Grow in={grow} style={{ transformOrigin: '0 0 0' }}{...(grow ? { timeout: 600 } : {})}>
                <Grid item xs={12} md={3} lg={3}>
                    <Card sx={{ padding: 1 }}>
                        <CardContent>
                            <Typography fontWeight={700}>Enter Payment Details</Typography>
                        </CardContent>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap:1.4 }}>
                            <TextField  type="text" label="OR Number" />
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <MobileDatePicker 
                                    value={bybDate}
                                    onChange={setBybDateHere}
                                    size="small"
                                    inputFormat="YYYY-MM-DD"
                                    mask="YYYY-MM-DD"
                                    label="Exam Schedule"
                                        />
                            </LocalizationProvider>
                            <FormControl>
                                <FormLabel><b>Exam Type</b></FormLabel>
                                <FormGroup row>
                                    <FormControlLabel labelPlacement="start" control={<Checkbox />} label="Traditional" />
                                    <FormControlLabel labelPlacement="start" control={<Checkbox />} label="Variable" />
                                </FormGroup>
                            </FormControl>
                            <Box sx={{ textAlign: 'right'}}>
                                <Button variant="contained" size="large" color="secondary" sx={{ mr:1, color: 'white' }}>Save</Button>
                                <Button variant="contained" size="large" color="error">Cancel</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grow>
            <Grow in={grow} style={{ transformOrigin: '0 0 0' }}{...(grow ? { timeout: 1400 } : {})}>
                <Grid item xs={12} md={9} lg={9}>
                    <Card sx={{ padding: 0 }}>
                        <CardContent >
                        <TextField value={search} onChange={(e) => {setSearch(e.target.value)}} sx={{ width: '50%' }} size="medium " placeholder="Search" InputProps={{startAdornment: <SearchIcon position="start"></SearchIcon>}}  />
                        </CardContent>
                        <DataGrid
                        columns={[
                            { field: 'id', headerName: 'ID'}, 
                            { field: 'first_name', headerName: 'Fullname', width: 250, valueGetter: (params) => `${params.row.first_name} ${params.row.middle_name} ${params.row.last_name}`},
                            { field: 'or_number', headerName: 'OR #', width: 150, },
                            { field: 'exam_type', headerName: 'Exam Type', width: 150, valueGetter: (params) => `${params.row.exam_traditional} / ${params.row.exam_variable}` },
                            { field: 'exam_date', headerName: 'Date of Exam', width: 150, renderCell: (params) => ( params.row.exam_date === '0000-00-00' ? "" : params.row.exam_date) },
                            { field: 'paid_exams', headerName: 'Payment Status', width: 200, renderCell: (params) => ( params.row.paid_exams === 0 ? <Chip label="Unpaid" color="error" /> : <Chip label="paid" color="success" /> ), align: 'center', headerAlign: 'center',},
                            { 
                                field: 'actions',
                                headerAlign: 'right',
                                headerName: 'Edit | Delete',    
                                width: 290,
                                align: 'right',
                                renderCell: (params) => {
                                    const ClickToUpdate = () => {
                                        setRecruitID(params.row.id)
                                    }
                                    return (
                                        <div>
                                        {selectedRowId === params.row.id ? (
                                          <>
                                            <Grow in={grow}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }} >
                                                <Box>
                                                <Typography fontSize={9} fontWeight={700}>
                                                    Are you sure you want to delete this data?
                                                </Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                <LoadingButton size="small" variant="contained" color="error" sx={{ mr: 0.5 }} onClick={() => setSelectedRowId(!selectedRowId)}>
                                                    Cancel
                                                </LoadingButton>
                                                <LoadingButton loading={deleteLoading} startIcon={<ThumbUpAltIcon fontSize="small"/>} loadingPosition="start" size="small" variant="contained" onClick={() => DeleteData(params.row.id)}>
                                                    {deleteLoading ? "Deleting ..." : "Confirm"}
                                                </LoadingButton>
                                                </Box>
                                            </Box>
                                            </Grow>
                                          </>
                                        ) : (
                                          <>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexDirection: 'row'}}>
                                                <Box sx={{ textAlign: 'left' }}>
                                                    {showUpdatedMessage && updatedRowId === params.row.id && (
                                                        <Fade in={grow}>
                                                            <Typography sx={{ color: 'green' }}>
                                                                  Successfully updated
                                                            </Typography>
                                                        </Fade>
                                                    )}
                                                </Box>
                                                <Box sx={{ textAlign: 'right', marginLeft: '50px' }}>
                                                    <IconButton onClick={ClickToUpdate}>
                                                        <EditIcon sx={{ color: 'green' }} />
                                                    </IconButton>
                                                    <IconButton onClick={() => setSelectedRowId(params.row.id)}>
                                                        <DeleteIcon sx={{ color: 'red' }} />
                                                    </IconButton>     
                                                </Box>            
                                            </Box>                  
                                          </>
                                        )}                
                                      </div>
                                    )
                                },
                            },
                        ]}
                        rows={recruitList}
                        slots={{ noRowsOverlay: loadingData ? DataLoading : NoDataFound, toolbar: GridToolbar }}
                        sx={{ '--DataGrid-overlayHeight': '300px', 
                        borderRadius: 0, 
                        borderLeft: 0, 
                        borderRight: 0, 
                        borderBottom: 0,
                        height:572.5,
                        maxHeight: 572.5,
                        '& .MuiDataGrid-columnHeaderTitle': {
                          fontWeight: 'bold',
                        },
                        [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
                            outline: 'none',
                        },
                        [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                        {
                            outline: 'none',
                        },
                      }}
                    />
                    </Card>
                </Grid>
            </Grow>
        </Grid>
    </Container>
  )
}

export default ExamPayment