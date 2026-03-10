import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Checkbox,
    FormControlLabel,
    Card,
    CardContent,
    Link,
    Alert,
    ThemeProvider,
    createTheme,
    CssBaseline,
    styled
} from '@mui/material';
import { User, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../images/logo.PNG';
import greenImage from '../images/green.jpg';

const theme = createTheme({
    palette: {
        primary: {
            main: '#8fb397', // Soft floral green
            contrastText: '#fff',
        },
        background: {
            default: '#f4f7f5', // Very light green-gray
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontFamily: "'Dancing Script', cursive" },
        h2: { fontFamily: "'Dancing Script', cursive" },
        h3: { fontFamily: "'Dancing Script', cursive" },
        h4: { fontFamily: "'Dancing Script', cursive" },
        h5: { fontFamily: "'Dancing Script', cursive" },
        h6: { fontFamily: "'Dancing Script', cursive" },
    },
    shape: {
        borderRadius: 12,
    },
});

const LoginCard = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 450,
    borderRadius: 20,
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    overflow: 'hidden',
}));

const CardHeader = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'backgroundImage',
})(({ theme, backgroundImage }) => ({
    height: 180,
    background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url("${backgroundImage}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: theme.spacing(3),
    color: '#fff',
}));

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [view, setView] = useState('login'); // 'login', 'setup', 'change'
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form states
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');

    const API_BASE_URL = 'http://localhost:5150/api'; // Corrected port from launchSettings.json

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const viewParam = params.get('view');
        if (viewParam === 'change') {
            setView('change');
        }

        const checkStatus = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/AdminAuth/status`);
                if (!response.ok) throw new Error('Status check failed');
                const data = await response.json();
                console.log("Setup status:", data);
                if (!data.isSetupDone) {
                    setView('setup');
                }
            } catch (err) {
                console.error("Failed to fetch setup status", err);
                setError('Could not connect to authentication server. Please ensure the .NET backend is running.');
            }
        };
        checkStatus();
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/AdminAuth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Login successful! Redirecting...');
                localStorage.setItem('florava_admin_logged_in', 'true');
                localStorage.setItem('florava_admin_token', data.token);
                setTimeout(() => navigate('/customer-home?admin=true'), 1500);
            } else {
                if (data.message === "Admin account not found.") {
                    setError('No admin account exists yet. Switching to Setup mode...');
                    setTimeout(() => {
                        setView('setup');
                        setError('');
                        setLoading(false);
                    }, 2000);
                } else {
                    setError(data.message || 'Invalid admin password.');
                    setLoading(false);
                }
            }
        } catch (err) {
            setError('Could not connect to authentication server.');
            setLoading(false);
        }
    };

    const handleSetup = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/AdminAuth/setup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Admin password configured! You can now login.');
                setTimeout(() => {
                    setView('login');
                    setPassword('');
                    setConfirmPassword('');
                    setSuccess('');
                    setLoading(false);
                }, 2000);
            } else {
                setError(data.message || 'Failed to setup admin account.');
                setLoading(false);
            }
        } catch (err) {
            setError('Could not connect to authentication server.');
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/AdminAuth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword, newPassword: password })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password changed successfully!');
                setTimeout(() => {
                    setView('login');
                    setOldPassword('');
                    setPassword('');
                    setConfirmPassword('');
                    setSuccess('');
                    setLoading(false);
                }, 2000);
            } else {
                setError(data.message || 'Failed to change password.');
                setLoading(false);
            }
        } catch (err) {
            setError('Could not connect to authentication server.');
            setLoading(false);
        }
    };

    const renderHeader = () => (
        <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid #eee' }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Box component="img" src={logoImage} alt="Florava Logo" sx={{ height: 40, mr: 1, borderRadius: '50%' }} />
                        <Typography
                            variant="h4"
                            sx={{
                                color: '#333',
                                fontFamily: "'Dancing Script', cursive",
                                fontWeight: 700,
                                fontSize: '2.2rem',
                                mt: 0.5
                            }}
                        >
                            Florava
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mr: 2, color: '#666', cursor: 'pointer' }}>Support</Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
                {renderHeader()}

                <Container
                    maxWidth="sm"
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 4
                    }}
                >
                    <LoginCard>
                        <CardHeader
                            backgroundImage={greenImage}
                        >
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {view === 'setup' ? 'Setup Admin' : view === 'change' ? 'Change Pass' : 'Admin Login'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {view === 'setup' ? 'Configure your initial management credentials' : 'Access the floral marketplace dashboard'}
                            </Typography>
                        </CardHeader>

                        <CardContent sx={{ p: 4 }}>
                            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                            <form onSubmit={view === 'setup' ? handleSetup : view === 'change' ? handleChangePassword : handleLogin}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#444' }}>
                                        Username
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        disabled
                                        value="admin"
                                        size="medium"
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                borderRadius: '12px',
                                                bgcolor: '#f8fafc',
                                                color: '#64748b',
                                                fontWeight: 600
                                            }
                                        }}
                                    />
                                </Box>

                                {view === 'change' && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#444' }}>
                                            Current Password
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter current password"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock size={20} color="#888" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                )}

                                <Box sx={{ mb: view === 'login' ? 1 : 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#444' }}>
                                        {view === 'setup' || view === 'change' ? 'New Password' : 'Password'}
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock size={20} color="#888" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>

                                {(view === 'setup' || view === 'change') && (
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#444' }}>
                                            Confirm Password
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock size={20} color="#888" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                )}

                                {view === 'login' && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <FormControlLabel
                                            control={<Checkbox size="small" />}
                                            label={<Typography variant="body2" color="text.secondary">Remember this device</Typography>}
                                        />
                                        <Link
                                            component="button"
                                            type="button"
                                            variant="body2"
                                            onClick={() => setView('change')}
                                            sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                        >
                                            Change Password
                                        </Link>
                                    </Box>
                                )}

                                <Button
                                    fullWidth
                                    variant="contained"
                                    type="submit"
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        mb: 3,
                                        borderRadius: 2,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : view === 'setup' ? 'Save Credentials' : view === 'change' ? 'Update Password' : 'Login to Dashboard'}
                                </Button>

                                <Box sx={{ textAlign: 'center' }}>
                                    <Button
                                        variant="text"
                                        startIcon={<ArrowLeft size={16} />}
                                        onClick={() => view !== 'login' ? setView('login') : navigate('/')}
                                        sx={{ color: '#888', textTransform: 'none' }}
                                    >
                                        Back to {view !== 'login' ? 'Login' : 'Home'}
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </LoginCard>
                </Container>

                <Box component="footer" sx={{ py: 3, textAlign: 'center', opacity: 0.6 }}>
                    <Typography variant="caption" display="block">
                        © 2026 Florava Admin. All rights reserved.
                    </Typography>
                    <Typography variant="caption">
                        Secure encrypted login.
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default AdminLoginPage;
