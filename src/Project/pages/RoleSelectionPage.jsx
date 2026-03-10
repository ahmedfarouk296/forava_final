import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    IconButton,
    ThemeProvider,
    createTheme,
    CssBaseline
} from '@mui/material';
import { User, Flower2, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoleCard from './components/RoleCard';

// Import local images
import customerImage from '../images/s-l1200.jpg';
import adminImage from '../images/a826abf19fde72e69fc3a6073f94b1dd.jpg';
import logoImage from '../images/logo.PNG';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3d5a3e', // Updated to match the new brand green
            contrastText: '#fff',
        },
        secondary: {
            main: '#f3e5f5',
        },
        background: {
            default: '#fafafa',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontFamily: "'Dancing Script', cursive" },
        h2: { fontFamily: "'Dancing Script', cursive" },
        h3: {
            fontFamily: "'Dancing Script', cursive",
            fontWeight: 700,
        },
        h4: { fontFamily: "'Dancing Script', cursive" },
        h5: { fontFamily: "'Dancing Script', cursive" },
        h6: {
            fontFamily: "'Dancing Script', cursive",
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
});

const RoleSelectionPage = () => {
    const navigate = useNavigate();

    const handleCustomerAction = () => {
        localStorage.removeItem('florava_admin_logged_in');
        navigate('/customer-home'); // Leads to the new Florava landing page
    };

    const handleAdminAction = () => {
        navigate('/admin-login');
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                {/* Header */}
                <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #eee', bgcolor: '#fff' }}>
                    <Container maxWidth="lg">
                        <Toolbar disableGutters sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                                <Box
                                    component="img"
                                    src={logoImage}
                                    alt="Florava Logo"
                                    sx={{ height: 45, mr: 1, borderRadius: '50%' }}
                                />
                                <Typography
                                    variant="h4"
                                    component="div"
                                    sx={{
                                        color: '#333',
                                        fontFamily: "'Dancing Script', cursive",
                                        fontWeight: 800,
                                        fontSize: '2.2rem',
                                        mt: 0.5
                                    }}
                                >
                                    Florava
                                </Typography>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

                {/* Main Content */}
                <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 1 }}>
                    <Container maxWidth="lg">
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Typography variant="h3" component="h1" gutterBottom color="#1a1a1a" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 0.5 }}>
                                Welcome to Florava Floral Marketplace
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
                                Choose your journey to explore fresh flowers or manage your catalog
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2.5, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'stretch' }}>
                            <RoleCard
                                roleLabel="CUSTOMER"
                                title="Flower Enthusiast"
                                description="Discover and explore beautiful flowers from Florava's curated collection. Perfect for every occasion."
                                buttonText="Explore Flowers"
                                image={customerImage}
                                onAction={handleCustomerAction}
                                badgeColor="success"
                            />
                            <RoleCard
                                roleLabel="ADMIN"
                                title="Florist Partner"
                                description="Access the management dashboard to add, edit, or remove flowers and manage your floral catalog."
                                buttonText="Manage Catalog"
                                image={adminImage}
                                onAction={handleAdminAction}
                                badgeColor="primary"
                            />
                        </Box>
                    </Container>
                </Box>

                {/* Footer */}
                <Box component="footer" sx={{ py: 1.5, px: 2, mt: 'auto', textAlign: 'center', borderTop: '1px solid #eee', bgcolor: '#fff' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1, color: '#3d5a3e' }}>
                        <Leaf size={16} />
                        <Flower2 size={16} />
                        <Leaf size={16} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        © 2026 Florava Floral Marketplace. All rights reserved.
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default RoleSelectionPage;
