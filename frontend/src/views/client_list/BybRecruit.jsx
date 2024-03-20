import { Box, Card, CardContent, Container, Grid, Grow, TextField, Typography, Button, IconButton, Fade, InputAdornment } from "@mui/material"
import Header from "../../components/Header/Header";
import SearchIcon from '@mui/icons-material/Search';
import NoDataFound from "../../components/NoDataFound/NoDataFound";
import DataLoading from "../../components/DataGridLoading/DataLoading";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useEffect, useState } from "react";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import toast from "react-hot-toast";
import http from "../../api/http";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from "@mui/lab";


const BybRecruit = () => {
  const grow = true;
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [updatedRowId, setUpdatedRowId] = useState(null);
  const [showUpdatedMessage, setShowUpdatedMessage] = useState(false);
  //recruit info here
  const [NRecId, setNRecId] = useState(0);
  const [fName, setFname] = useState('');
  const [mName, setMname] = useState('');
  const [lName, setLname] = useState('');
  const [cNumber, setCNumber] = useState('');
  const [bybDate, setBybDate] = useState(null);
  const [recName, setRecName] = useState('');
  const [bybType, setBybType] = useState(0);
  const [umName, setUmName] = useState(0);
  // Data List
  const [bybList, setBybList] = useState([]);
  const [UmList, setUmList] = useState([]);
  const [NewRecruitList, setNewRecruitList] = useState([])
  const [search, setSearch] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  


  useEffect(() => {
    async function getAll() {
      await Promise.all([
        fetchBybList(),
        fetchUmList(),
        fetchNewRecList(),
      ])
    }
    if (updatedRowId) {
      setShowUpdatedMessage(true);
      const timer = setTimeout(() => {
          setShowUpdatedMessage(false);
          setUpdatedRowId(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
    getAll();
  }, [updatedRowId]);

  const fetchBybList = async () => {
    try {
      const result = await http.get('/byb-list');
      const bybDataWithKeys = result.data;
      setBybList(bybDataWithKeys);
    } catch (error) {
      toast.error('Error fetching data:', error);
    }
  };

  const fetchUmList = async () => {
    try {
        const result = await http.get('/um-list');
        const UmDataWithKeys = result.data;
        setUmList(UmDataWithKeys);
    } catch (err) {
        toast.error('Error fetching data', err)
    }
  }

  const fetchNewRecList = async () => {
      setLoadingData(true)
    try {
      const result = await http.get('/new-recruit');
      const bybDataWithKeys = result.data; 
      setNewRecruitList(bybDataWithKeys);
      setLoadingData(false)
    } catch (error) {
      toast.error('Error fetching data:', error);
    }
  };

  async function saveNewRecruit() {
    event.preventDefault();
    setSaveLoading(true);
    try {
      await http.post('/new-recruit' , {
          first_name: fName,
          middle_name: mName,
          last_name:  lName,
          contact_number: cNumber,
          byb_date: bybDate,
          recruiters_name: recName,
          byb_type_id: bybType,
          manager_id: umName
      })
      fetchNewRecList();
      ClearData();
      setSaveLoading(false);
      toast.success("New recruit has been saved.")
    } catch (err) {
      setSaveLoading(false);
      toast.error(err);
    } 
  }

  const setBybDateHere = (newDate) => {
    const formattedDate = dayjs(newDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
    setBybDate(formattedDate);
  };

  async function DeleteData(id) {
    setDeleteLoading(true)
    try {
        await http.delete(`/new-recruit?id=${id}`);
        toast.success("Data has been deleted.");
        setDeleteLoading(false)
        fetchNewRecList();
    } catch(err) {
        toast.error(err)
    }
}

async function UpdateBybList() {
    setEditLoading(true);
    event.preventDefault();
    try {
        await http.post('new-recruit', {
            id: NRecId,
            first_name: fName,
            middle_name: mName,
            last_name:  lName,
            contact_number: cNumber,
            byb_date: bybDate,
            recruiters_name: recName,
            byb_type_id: bybType,
            manager_id: umName
        });
        ClearData();
        fetchNewRecList();
        setEditLoading(false);
        setUpdatedRowId(NRecId);
        toast.success("Data has been updated.");
    } catch (err) {
        setEditLoading(false);
        toast.error(err)
    }
  } 

  const ClearData = () => {
    setNRecId(0);
    setFname('');
    setMname('');
    setLname('');
    setCNumber('');
    setBybDate(null);
    setRecName('');
    setBybType('');
    setUmName('');
    setRecName('');
  }

  const SearchFilterBybList = (rows) => {
      return rows.filter(row =>
          row.first_name.toLowerCase().includes(search.toLowerCase())
      );
  };


  


  return (
    <Container maxWidth="xxl" sx={{ paddingTop: '55px' }}>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grow in={grow} style={{ transformOrigin: '0 0 0' }}{...(grow ? { timeout: 600 } : {})}>
            <Grid item xs={12} md={12} lg={12}>  
                  <Header title="New Recruit Entry" />
            </Grid>
          </Grow>
          <Grow in={grow} style={{ transformOrigin: '0 0 0' }}{...(grow ? { timeout: 1000 } : {})}>
              <Grid item xs={12} md={3} lg={3}>
                  <Card sx={{ padding: 1 }}>
                      <CardContent>
                          <Typography fontWeight={700}>Input Basic Information</Typography>
                      </CardContent>
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap:1.4 }}>
                        <TextField type="text" size="medium" fullWidth label="First name" value={fName} onChange={(e) => {setFname(e.target.value)}} />
                        <TextField type="text" size="medium" fullWidth label="Middle name" value={mName} onChange={(e) => {setMname(e.target.value)}} />
                        <TextField type="text" size="medium" fullWidth label="Last name" value={lName} onChange={(e) => {setLname(e.target.value)}} />
                        <TextField type="number" size="medium" fullWidth label="Contact Number" value={cNumber} onChange={(e) => {setCNumber(e.target.value)}} InputProps={{
                                        startAdornment: <InputAdornment position="start">63+</InputAdornment>,
                                    }} onInput = {(e) =>{
                                      e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)}} />
                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <MobileDatePicker 
                                            value={bybDate}
                                            onChange={setBybDateHere}
                                            size="small"
                                            inputFormat="YYYY-MM-DD"
                                            mask="YYYY-MM-DD"
                                            label="BYB Date"
                                             />
                                    </LocalizationProvider>
                        <TextField size="medium" fullWidth label="Recruiters name" value={recName} onChange={(e) => {setRecName(e.target.value)}} />
                        <TextField value={bybType} onChange={(e) => {setBybType(e.target.value)}} fullWidth size="medium" select label="Type of Byb" variant="outlined" SelectProps={{ native: true }}>
                          <option></option>
                          {bybList.map((BybType, index) => (
                            <option key={index} value={BybType.id}>
                                {BybType.type_of_byb}
                            </option>
                          ))}
                        </TextField>
                        <TextField value={umName} onChange={(e) => {setUmName(e.target.value)}} fullWidth size="medium" select label="Unit Managers Name" variant="outlined" SelectProps={{ native: true }}>
                          <option></option>
                          {UmList.map((umLists, index) => (
                            <option key={index} value={umLists.id}>
                               {umLists.unit} {umLists.unit_manager_name}
                            </option>
                          ))}
                        </TextField>
                        <Box sx={{ textAlign: 'right' }}>
                          {NRecId != 0 ? ( 
                              <LoadingButton onClick={UpdateBybList} loading={editLoading} loadingPosition="start" startIcon={<SaveIcon />} size="medium" variant="contained" sx={{ mr:1 }}>{editLoading ? "Updating ..." : "Update"}</LoadingButton> 
                          ) : (
                              <LoadingButton onClick={saveNewRecruit} loading={saveLoading} loadingPosition="start" startIcon={<SaveIcon />} size="medium" variant="contained" sx={{ mr:1 }}>{saveLoading ? "Saving ..." : "Save"}</LoadingButton>
                          )}  
                          <Button size="large" variant="contained" color="error" onClick={ClearData}>cancel</Button>
                        </Box>
                      </CardContent>
                  </Card>
              </Grid>
          </Grow>
          <Grow in={grow} style={{ transformOrigin: '0 0 0' }}{...(grow ? { timeout: 1400 } : {})}>
              <Grid item xs={12} md={9} lg={9}>
                  <Card sx={{ padding: 0 }}>
                    <CardContent>
                        <TextField value={search} onChange={(e) => {setSearch(e.target.value)}} sx={{ width: '50%' }} size="medium " placeholder="Search" InputProps={{startAdornment: <SearchIcon position="start"></SearchIcon>}}  />
                    </CardContent>
                    <DataGrid
                        columns={[
                            { field: 'id', headerName: 'ID'}, 
                            { field: 'first_name', headerName: 'Fullname', width: 250, valueGetter: (params) => `${params.row.first_name} ${params.row.middle_name} ${params.row.last_name}`},
                            { field: 'contact_number', headerName: 'Contact # ', width: 150, },
                            { field: 'recruiters_name', headerName: 'Recruiter' },
                            { field: 'type_of_byb', headerName: 'BYB Attended', width: 150, },
                            { field: 'Manager', headerName: 'Unit Manager', width: 200, valueGetter: (params) => `${params.row.unit} - ${params.row.unit_manager_name}` },
                            { field: 'byb_date', headerName: 'Date of BYB', width: 150, },
                            { 
                                field: 'actions',
                                headerAlign: 'right',
                                headerName: 'Edit | Delete',    
                                width: 290,
                                align: 'right',
                                renderCell: (params) => {
                                    const ClickToUpdate = () => {
                                        setNRecId(params.row.id)
                                        setFname(params.row.first_name)
                                        setMname(params.row.middle_name)
                                        setLname(params.row.last_name)
                                        setCNumber(params.row.contact_number)
                                        setRecName(params.row.recruiters_name)
                                        setBybDate(dayjs(params.row.byb_date))
                                        setBybType(params.row.byb_type_id)
                                        setUmName(params.row.manager_id)
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
                        rows={SearchFilterBybList(NewRecruitList)}
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
                      }}
                    />
                  </Card>
              </Grid>
          </Grow>
        </Grid>
    </Container>
  )
}

export default BybRecruit