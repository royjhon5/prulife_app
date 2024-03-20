import { forwardRef, useEffect, useState } from "react"
import { Button, Card, CardContent, Container, Grid, Grow, TextField, Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Fade } from "@mui/material"
import Header from '../../components/Header/Header'
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import NoDataFound from "../../components/NoDataFound/NoDataFound";
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import http from '../../api/http'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-hot-toast'
import { LoadingButton } from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

const Document_list = () => {
  const grow = true;
  const [openDialog, setOpenDialog] = useState(false);
  const [reqList, setReqList] = useState([]);
  const [reqName, setReqName] = useState('')
  const [loadingButton, setLoadingButton] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [reqId, setReqId] = useState(0);
  const [search, setSearch] = useState('');
  const [updatedRowId, setUpdatedRowId] = useState(null);
  const [showUpdatedMessage, setShowUpdatedMessage] = useState(false);

  const openDialogs = () => {
    setOpenDialog(true);
    setReqName('');
    setReqId(0);
  }

  const closeDialog = () => {
      setOpenDialog(false);
      setReqName('');
      setReqId(0);
  }

  useEffect(() => {
    fetchReqList();
    if (updatedRowId) {
      setShowUpdatedMessage(true);
      const timer = setTimeout(() => {
          setShowUpdatedMessage(false);
          setUpdatedRowId(null);
      }, 5000);
      return () => clearTimeout(timer);
  }
  }, [updatedRowId]);

  async function fetchReqList() {
    try {
      const result = await http.get('/req-list');
      const ReqDataWithKeys = result.data.map((row, index) => {
        return { ...row, key: row.id || index };
      });
      setReqList(ReqDataWithKeys)
    } catch (err) {
      toast.error(err)
    } 
  }


  async function SaveReqDetails() {
    event.preventDefault();
    setLoadingButton(true);
    if (reqName === '' ) return toast.error("Requirements description required.") 
    try {
      await http.post('req-list', {
        requirements: reqName
      });
      setReqName('');
      setLoadingButton(false)
      fetchReqList();
      toast.success("New data has been saved.")
    } catch (err) { 
      toast.error(err)
      setLoadingButton(false)
    } 
  }

  async function DeleteData(id) {
    setDeleteLoading(true)
    try {
        await http.delete(`/req-list?id=${id}`);
        toast.success("Data has been deleted.");
        setDeleteLoading(false)
        fetchReqList();
    } catch(err) {
        toast.error(err)
    }
  } 


  async function UpdateReqList() {
    setEditLoading(true);
    event.preventDefault();
    try {
        await http.post('/req-list', {
            id: reqId,
            requirements: reqName,
        });
        setReqName('');
        fetchReqList();
        setOpenDialog(false); 
        setEditLoading(false);
        setUpdatedRowId(reqId);
        toast.success("Data has been updated.")
    } catch (err) {
        toast.error(err)
    }
  }

  const SearchFilterBybList = (rows) => {
    return rows.filter(row =>
        row.requirements.toLowerCase().includes(search.toLowerCase())
    );
  };


  return (
    <>
      <Dialog fullWidth={true} maxWidth={"sm"} open={openDialog} TransitionComponent={Transition} keepMounted onClose={closeDialog} sx={{ borderRadius: 0 }}>
            <DialogTitle sx={{ background: 'grey', borderRadius: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography variant="h5" fontWeight="bold">{reqId != 0 ? ( "Update Information" ) : ( "Add New" ) }</Typography>
                    <IconButton size="small" onClick={closeDialog}>
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ width:'100%' }}>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField value={reqName} fullWidth size='medium' label="Requirements" onChange={(e) => {setReqName(e.target.value)}} />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', gap: 1, textAlign: 'right', width: '100%' }}>
                    {reqId != 0 ? ( 
                        <LoadingButton onClick={UpdateReqList} loading={editLoading} loadingPosition="start" startIcon={<SaveIcon />} size="small" variant="contained">{editLoading ? "Updating ..." : "Update"}</LoadingButton> 
                    ) : (
                        <LoadingButton onClick={SaveReqDetails} loading={loadingButton} loadingPosition="start" startIcon={<SaveIcon />} size="small" variant="contained">{loadingButton ? "Saving ..." : "Save"}</LoadingButton>
                    )}   
                    <Button onClick={closeDialog} color="error" variant="contained">Close</Button>
                </Box>
            </DialogContent>
      </Dialog>
      <Container maxWidth="md" sx={{ paddingTop: '130px' }}>
        <Grid container>
            <Grow in={grow}>
                  <Grid item xs={12} md={12} lg={12} style={{ transformOrigin: '0 0 0' }}{...(grow ? { timeout: 600 } : {})}>
                    <Header title="Requirements List"/>
                  </Grid>
            </Grow>
            <Grow in={grow} style={{ transformOrigin: '0 0 0' }}{...(grow ? { timeout: 1000 } : {})}>
                <Grid item xs={12} md={12} lg={12}>
                    <Card elevation={1}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <TextField onChange={(e) => {setSearch(e.target.value)}} size="small" placeholder="Search" InputProps={{startAdornment: <SearchIcon position="start"></SearchIcon>}} /> 
                            <Button color="secondary" variant="contained" onClick={openDialogs} sx={{ color: 'white' }} startIcon={<AddCircleIcon sx={{ color: 'white'}} />}>
                                Add New
                            </Button>
                        </CardContent>                    
                        <DataGrid
                            columns={[
                                { field: 'id', headerName: <b>ID</b> }, 
                                { field: 'requirements', headerName: <b>Requirements</b>, width: 400, },
                                { 
                                    headerAlign: 'right',
                                    headerName: <b>Edit | Delete</b>,    
                                    width: 350,
                                    align: 'right',
                                    renderCell: (params) => {
                                        const openEditDialog = () => {
                                            setOpenDialog(true);
                                            setReqName(params.row.requirements);
                                            setReqId(params.row.id);
                                        }
                                        return (
                                            <div>
                                            {selectedRowId === params.row.id ? (
                                              <>
                                                <Grow in={grow}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Box>
                                                    <Typography fontSize={9} fontWeight={700}>
                                                        Are you sure you want to delete this data?
                                                    </Typography>
                                                    </Box>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                    <LoadingButton size="small" variant="contained" color="error" sx={{ mr: 0.5 }} onClick={() => setSelectedRowId(!selectedRowId)}>
                                                        Cancel
                                                    </LoadingButton>
                                                    <LoadingButton onClick={() => DeleteData(params.row.id)} loading={deleteLoading} startIcon={<ThumbUpAltIcon fontSize="small"/>} loadingPosition="start" size="small" variant="contained">
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
                                                        <Box sx={{ textAlign: 'right', marginLeft: '80px' }}>
                                                            <IconButton onClick={openEditDialog}>
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
                            rows={SearchFilterBybList(reqList)}
                            slots={{ noRowsOverlay: NoDataFound, toolbar: GridToolbar }}
                            sx={{ '--DataGrid-overlayHeight': '300px', 
                            borderRadius: 0, 
                            borderLeft: 0, 
                            borderRight: 0, 
                            borderBottom: 0,
                            height:450,
                            maxHeight: 450,
                          }}
                        />
                    </Card>
                  </Grid>
            </Grow>
        </Grid>
    </Container>
    </>
  )
}

export default Document_list