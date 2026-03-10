import React from 'react';
import { Box, Container, IconButton, Badge, Typography, Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, Grid, Drawer } from '@mui/material';
import { User, ShoppingCart, Settings, LogOut, ChevronDown, Shield, User as UserIcon, X, Instagram, Music, Menu as MenuIcon } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../../images/logo.PNG';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAdminState, setIsAdminState] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isContactOpen, setIsContactOpen] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const isMenuOpen = Boolean(anchorEl);

    React.useEffect(() => {
        const adminFlag = localStorage.getItem('florava_admin_logged_in');
        setIsAdminState(adminFlag === 'true');
    }, [location]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSwitchToAdmin = () => {
        handleMenuClose();
        navigate('/admin-login');
    };

    const handleSwitchToUser = () => {
        handleMenuClose();
        localStorage.removeItem('florava_admin_logged_in');
        localStorage.removeItem('florava_admin_token');
        setIsAdminState(false);
        navigate('/customer-home');
    };

    const handleLogoutAdmin = () => {
        handleMenuClose();
        localStorage.removeItem('florava_admin_logged_in');
        localStorage.removeItem('florava_admin_token');
        setIsAdminState(false);
        navigate('/customer-home');
    };

    const handleOpenChangePassword = () => {
        handleMenuClose();
        navigate('/admin-login?view=change');
    };

    const isAdmin = new URLSearchParams(location.search).get('admin') === 'true' && localStorage.getItem('florava_admin_logged_in') === 'true';
    const homePath = isAdmin ? "/customer-home?admin=true" : "/customer-home";
    const flowersPath = isAdmin ? "/flowers?admin=true" : "/flowers";
    const currentRole = isAdmin ? 'Admin' : 'User';

    return (
        <Box sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', bgcolor: '#fff', position: 'sticky', top: 0, zIndex: 1100 }}>
            <Container maxWidth="xl">
                <Box sx={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Mobile Menu Icon */}
                    <IconButton
                        sx={{ display: { xs: 'flex', md: 'none' }, color: '#1a1a1a' }}
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <MenuIcon size={24} />
                    </IconButton>

                    {/* Logo & Brand */}
                    <Box
                        component={Link}
                        to="/"
                        sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 1.2 }}
                    >
                        <Box
                            component="img"
                            src={logoImage}
                            alt="Florava"
                            sx={{ height: 32, width: 32, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                color: '#1e293b',
                                letterSpacing: '0.5px',
                                fontSize: '1.4rem',
                                cursor: 'pointer',
                                fontFamily: "'Dancing Script', cursive"
                            }}
                        >
                            Florava
                        </Typography>
                    </Box>

                    {/* Navigation Links */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                        <Link to={homePath} style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 500, fontSize: '0.9rem' }}>Home</Link>
                        <Link to={flowersPath} style={{ textDecoration: 'none', color: '#666', fontWeight: 500, fontSize: '0.9rem' }}>Flowers</Link>
                        <Box
                            onClick={() => setIsContactOpen(true)}
                            sx={{ cursor: 'pointer', color: '#666', fontWeight: 500, fontSize: '0.9rem', '&:hover': { color: '#1a1a1a' } }}
                        >
                            Contact
                        </Box>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {/* Role Selector Dropdown */}
                        <Box>
                            <Button
                                onClick={handleMenuOpen}
                                endIcon={<ChevronDown size={14} />}
                                sx={{
                                    color: currentRole === 'Admin' ? '#3d5a3e' : '#64748b',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '0.85rem',
                                    bgcolor: currentRole === 'Admin' ? '#f0f4f0' : '#f8fafc',
                                    px: 2,
                                    borderRadius: '8px',
                                    '&:hover': { bgcolor: currentRole === 'Admin' ? '#e0e8e0' : '#f1f5f9' }
                                }}
                            >
                                {currentRole}
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={isMenuOpen}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    sx: {
                                        mt: 1,
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                        borderRadius: '12px',
                                        minWidth: '160px',
                                        border: '1px solid #f1f5f9'
                                    }
                                }}
                            >
                                <MenuItem
                                    onClick={handleSwitchToUser}
                                    sx={{
                                        fontSize: '0.9rem',
                                        fontWeight: currentRole === 'User' ? 700 : 500,
                                        color: currentRole === 'User' ? '#3d5a3e' : '#1e293b',
                                        py: 1,
                                        gap: 1.5
                                    }}
                                >
                                    User View
                                </MenuItem>
                                <MenuItem
                                    onClick={handleSwitchToAdmin}
                                    sx={{
                                        fontSize: '0.9rem',
                                        fontWeight: currentRole === 'Admin' ? 700 : 500,
                                        color: currentRole === 'Admin' ? '#3d5a3e' : '#1e293b',
                                        py: 1,
                                        gap: 1.5
                                    }}
                                >
                                    Admin Management
                                </MenuItem>

                                <Box sx={{ borderTop: '1px solid #f1f5f9', mt: 1, pt: 0.5 }}>
                                    <MenuItem
                                        onClick={handleOpenChangePassword}
                                        sx={{
                                            fontSize: '0.9rem',
                                            color: '#64748b',
                                            py: 1,
                                            gap: 1.5
                                        }}
                                    >
                                        <Settings size={18} /> Change Password
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleLogoutAdmin}
                                        sx={{
                                            fontSize: '0.9rem',
                                            color: '#ef4444',
                                            py: 1,
                                            gap: 1.5
                                        }}
                                    >
                                        <LogOut size={18} /> Logout Admin
                                    </MenuItem>
                                </Box>
                            </Menu>
                        </Box>

                    </Box>
                </Box>
            </Container>

            {/* Contact Us Dialog */}
            <Dialog
                open={isContactOpen}
                onClose={() => setIsContactOpen(false)}
                PaperProps={{
                    sx: { borderRadius: '16px', p: 1, minWidth: '320px' }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 800, fontFamily: "'Dancing Script', cursive", fontSize: '1.8rem', color: '#3d5a3e' }}>
                    Connect with Florava
                    <IconButton onClick={() => setIsContactOpen(false)} size="small">
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Follow us for fresh updates, floral inspiration, and behind-the-scenes magic.
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="outlined"
                                component="a"
                                href="https://www.instagram.com/florava.eg?igsh=MWVtNG9ycWt6ZnU3dQ=="
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<Instagram size={20} />}
                                sx={{
                                    py: 2,
                                    flexDirection: 'column',
                                    gap: 1,
                                    borderRadius: '12px',
                                    color: '#E4405F',
                                    borderColor: '#E4405F',
                                    '&:hover': { bgcolor: '#fff5f7', borderColor: '#E4405F' },
                                    textTransform: 'none'
                                }}
                            >
                                Instagram
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="outlined"
                                component="a"
                                href="https://www.tiktok.com/@florava76?_r=1&_t=ZS-94YVKBuZdrR"
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<Music size={20} />}
                                sx={{
                                    py: 2,
                                    flexDirection: 'column',
                                    gap: 1,
                                    borderRadius: '12px',
                                    color: '#000000',
                                    borderColor: '#000000',
                                    '&:hover': { bgcolor: '#f3f4f6', borderColor: '#000000' },
                                    textTransform: 'none'
                                }}
                            >
                                TikTok
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>

            {/* Mobile Navigation Drawer */}
            <Drawer
                anchor="left"
                open={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                PaperProps={{
                    sx: { width: '280px', p: 3 }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Box component="img" src={logoImage} alt="Florava" sx={{ height: 28, width: 28, borderRadius: '50%' }} />
                        <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Dancing Script', cursive", fontSize: '1.3rem' }}>Florava</Typography>
                    </Box>
                    <IconButton onClick={() => setIsMobileMenuOpen(false)} size="small">
                        <X size={20} />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Link
                        to={homePath}
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 700, fontSize: '1.1rem' }}
                    >
                        Home
                    </Link>
                    <Link
                        to={flowersPath}
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{ textDecoration: 'none', color: '#64748b', fontWeight: 600, fontSize: '1.1rem' }}
                    >
                        Flowers Catalog
                    </Link>
                    <Typography
                        onClick={() => { setIsMobileMenuOpen(false); setIsContactOpen(true); }}
                        sx={{ cursor: 'pointer', color: '#64748b', fontWeight: 600, fontSize: '1.1rem' }}
                    >
                        Contact Us
                    </Typography>
                </Box>

                <Box sx={{ mt: 'auto', pt: 4, borderTop: '1px solid #f1f5f9' }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 2 }}>
                        SOCIAL MEDIA
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <IconButton
                            component="a"
                            href="https://www.instagram.com/florava.eg?igsh=MWVtNG9ycWt6ZnU3dQ=="
                            target="_blank"
                            sx={{ color: '#E4405F', bgcolor: '#fff5f7' }}
                        >
                            <Instagram size={20} />
                        </IconButton>
                        <IconButton
                            component="a"
                            href="https://www.tiktok.com/@florava76?_r=1&_t=ZS-94YVKBuZdrR"
                            target="_blank"
                            sx={{ color: '#000', bgcolor: '#f3f4f6' }}
                        >
                            <Music size={20} />
                        </IconButton>
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Navbar;
