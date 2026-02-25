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
import './MainLayout.css';

export function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = (open: boolean) => () => {
        setIsSidebarOpen(open);
    };

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Flow Map', path: '/flow' }
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
                    <div className="logo">My App</div>
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
