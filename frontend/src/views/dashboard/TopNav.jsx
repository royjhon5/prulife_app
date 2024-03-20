import { AppBar, Menu, Button, MenuItem, Box, Container } from "@mui/material"
import { useState } from "react";
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import PaidIcon from '@mui/icons-material/Paid';
const TopNav = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDashboard = () => {
    navigate('/dashboard')
  }

  const openManagerList = () => {
    navigate('/manager-list')
  }

  const openBybList = () => {
    navigate('/byb-list')
  }

  const openReqList = () => {
    navigate('/req-list')
  }

  const openNewRecruit = () => {
    navigate('/new-recruit');
  }

  const openExamPayment = () => {
    navigate('/exam-payment')
  }


  return (
    <AppBar sx={{ padding: 3, background: 'red' }} position="static">
        <Container maxWidth="xxl" sx={{ display: 'flex', justifyContent: 'space-between'}}>
            <Box>
                <Button sx={{ color: 'white' }} size="large" startIcon={<DashboardIcon />} onClick={openDashboard}>
                    Dashboard
                </Button>
                <Button
                    size="large"
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{ color: 'white' }}
                    startIcon={<FolderIcon />}
                >
                    Masterfile
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={openManagerList}>Unit Manager List</MenuItem>
                    <MenuItem onClick={openBybList}>BYB List </MenuItem>
                    <MenuItem onClick={openReqList}>Document List </MenuItem>
                </Menu>
                <Button onClick={openNewRecruit} sx={{ color: 'white' }} size="large" startIcon={<PersonAddIcon />}>
                    New Recruit
                </Button>
                <Button onClick={openExamPayment} sx={{ color: 'white' }} size="large" startIcon={<PaidIcon />}>
                    Exam Payment
                </Button>
                <Button sx={{ color: 'white' }} size="large" startIcon={<CreateNewFolderIcon />}>
                    Process New Client Code
                </Button>
            </Box>
            <Box>
                <Button startIcon={<LogoutIcon sx={{ color: 'white'}} />}>
                </Button>
            </Box>
        </Container>
    </AppBar>
  )
}

export default TopNav