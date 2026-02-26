import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import './MainLayout.css';

export function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const { logout, user } = useAuth();

    const toggleSidebar = (open: boolean) => () => {
        setIsSidebarOpen(open);
    };

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Profile', path: '/profile' }
    ];

    const sidebarContent = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleSidebar(false)}
            onKeyDown={toggleSidebar(false)}
        >
            <List>
                {navLinks.map((link) => (
                    <ListItem key={link.label} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={link.path}
                            selected={location.pathname === link.path}
                        >
                            <ListItemText primary={link.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div className="layout-container">
            <header className="layout-header">
                <div className="header-left">
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleSidebar(true)}
                        sx={{ mr: 2, color: '#333' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div className="logo">Al` JNS</div>
                </div>
                <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {user && <span style={{ color: '#666', fontSize: '14px' }}>{user.email}</span>}
                    <Button
                        onClick={logout}
                        startIcon={<LogoutIcon />}
                        variant="outlined"
                        size="small"
                        sx={{ color: '#4f46e5', borderColor: '#4f46e5' }}
                    >
                        Logout
                    </Button>
                </div>
            </header>

            <Drawer
                anchor="left"
                open={isSidebarOpen}
                onClose={toggleSidebar(false)}
            >
                {sidebarContent}
            </Drawer>

            <main className="layout-main">
                <Outlet />
            </main>
        </div>
    );
}
