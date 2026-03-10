import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Grid, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, Pagination } from '@mui/material';
import { ArrowRight, Plus, LogOut, Check, Star, Trash2, TrendingUp, Upload, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FlowerCard from './components/FlowerCard';

// Import local images
import heroImage from '../images/hero_flowers.png';
import pinkRosesImg from '../images/pink_roses.png';
import yellowTulipsImg from '../images/yellow_tulips.png';
import sunflowersImg from '../images/sunflowers.png';

const CustomerLandingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = new URLSearchParams(location.search).get('admin') === 'true' && localStorage.getItem('florava_admin_logged_in') === 'true';

    // State for all flowers
    const [flowers, setFlowers] = useState([]);
    const [bestsellerId, setBestsellerId] = useState(null);
    const [trendingIds, setTrendingIds] = useState([]);
    const [heroImageState, setHeroImageState] = useState(heroImage);
    const [heroTitle, setHeroTitle] = useState('Handcrafted Elegance, Forever in Bloom');
    const [heroSubtitle, setHeroSubtitle] = useState('Discover the artistry of everlasting florals. Each petal and leaf is meticulously handcrafted using premium pipe cleaners to create bespoke arrangements that never fade.');

    // Modal state
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newFlower, setNewFlower] = useState({
        name: '',
        price: '',
        sku: '',
        image: '',
        badge: '',
        badgeColor: '#3d5a3e',
        rating: 5.0,
        description: ''
    });
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingFlower, setEditingFlower] = useState(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedFlower, setSelectedFlower] = useState(null);
    const [currentPageCollection, setCurrentPageCollection] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Default flowers data
    const initialFlowers = [
        { id: '1', sku: 'BB-001', name: 'Velvet Pink Roses', price: 49.00, rating: 4.9, image: pinkRosesImg, badge: 'New', badgeColor: '#3d5a3e', description: 'A luxurious arrangement of premium pink velvet roses, meticulously handcrafted to capture the essence of romance.' },
        { id: '2', sku: 'BB-042', name: 'Rainbow Tulips', price: 35.00, rating: 4.7, image: yellowTulipsImg, badge: 'Popular', badgeColor: '#f97316', description: 'Vibrant and cheerful, these rainbow tulips bring a burst of color and joy to any room, lasting forever.' },
        { id: '3', sku: 'BB-109', name: 'Sun-Kissed Golden', price: 28.00, rating: 4.5, image: sunflowersImg, description: 'Bright sunflowers that radiate warmth and happiness, crafted with high-quality materials for a natural look.' },
        { id: '4', sku: 'BB-002', name: 'Blushing Peonies', price: 55.00, rating: 4.8, image: pinkRosesImg, badge: 'New', description: 'Soft and elegant blushing peonies that add a touch of sophistication to your special moments.' }
    ];

    useEffect(() => {
        // Security check: If URL has ?admin=true but not logged in, redirect to login
        const urlParams = new URLSearchParams(location.search);
        const hasAdminParam = urlParams.get('admin') === 'true';
        const isLoggedIn = localStorage.getItem('florava_admin_logged_in') === 'true';

        if (hasAdminParam && !isLoggedIn) {
            navigate('/admin-login');
            return;
        }

        // Load from localStorage or use defaults
        const savedFlowers = localStorage.getItem('florava_flowers');
        const savedBestseller = localStorage.getItem('florava_bestseller');
        const savedTrending = localStorage.getItem('florava_trending');
        const savedHero = localStorage.getItem('florava_hero_image');
        const savedTitle = localStorage.getItem('florava_hero_title');
        const savedSubtitle = localStorage.getItem('florava_hero_subtitle');

        if (savedHero) setHeroImageState(savedHero);
        if (savedTitle) setHeroTitle(savedTitle);
        if (savedSubtitle) setHeroSubtitle(savedSubtitle);

        if (savedFlowers) {
            try {
                const parsed = JSON.parse(savedFlowers);
                if (Array.isArray(parsed)) setFlowers(parsed);
                else setFlowers(initialFlowers);
            } catch (e) {
                setFlowers(initialFlowers);
            }
        } else {
            setFlowers(initialFlowers);
            localStorage.setItem('florava_flowers', JSON.stringify(initialFlowers));
        }

        if (savedBestseller) {
            setBestsellerId(savedBestseller);
        } else {
            setBestsellerId('4'); // Default bestseller
        }

        if (savedTrending) {
            try {
                const parsed = JSON.parse(savedTrending);
                if (Array.isArray(parsed)) setTrendingIds(parsed);
                else setTrendingIds(['1', '2', '3', '4']);
            } catch (e) {
                setTrendingIds(['1', '2', '3', '4']);
            }
        } else {
            setTrendingIds(['1', '2', '3', '4']);
        }
    }, []);

    const handleExplore = () => {
        navigate('/flowers');
    };

    const handleExitAdmin = () => {
        navigate('/customer-home');
    };

    // Admin Actions
    const handleAddFlower = () => {
        try {
            const flowerToAdd = {
                ...newFlower,
                id: Date.now().toString(),
                price: parseFloat(newFlower.price)
            };
            const updatedFlowers = [...flowers, flowerToAdd];

            // Check approximate size before saving
            const totalSize = JSON.stringify(updatedFlowers).length;
            if (totalSize > 4.8 * 1024 * 1024) {
                alert("Cannot add flower: Total catalog size would exceed 5MB browser limit. Please remove some existing flowers or videos first!");
                return;
            }

            setFlowers(updatedFlowers);
            localStorage.setItem('florava_flowers', JSON.stringify(updatedFlowers));
            setOpenAddModal(false);
            setNewFlower({ name: '', price: '', sku: '', image: '', badge: '', badgeColor: '#3d5a3e', rating: 5.0 });
        } catch (e) {
            console.error("Failed to save flower:", e);
            alert("Storage limit exceeded! Browser allows only 5MB total. Try removing old flowers or using a smaller video.");
        }
    };


    const handleRemoveFlower = (id) => {
        const updatedFlowers = flowers.filter(f => f.id !== id);
        setFlowers(updatedFlowers);
        localStorage.setItem('florava_flowers', JSON.stringify(updatedFlowers));

        // Cleanup bestseller/trending if removed
        if (bestsellerId === id) setBestsellerId(null);
        const updatedTrending = trendingIds.filter(tid => tid !== id);
        setTrendingIds(updatedTrending);
        localStorage.setItem('florava_trending', JSON.stringify(updatedTrending));
    };

    const handleSetBestseller = (id) => {
        setBestsellerId(id);
        localStorage.setItem('florava_bestseller', id);
    };

    const handleToggleTrending = (id) => {
        let updated;
        if (trendingIds.includes(id)) {
            updated = trendingIds.filter(tid => tid !== id);
        } else {
            updated = [...trendingIds, id];
        }
        setTrendingIds(updated);
        localStorage.setItem('florava_trending', JSON.stringify(updated));
    };

    const handleFileChange = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 4.5MB to stay under local storage limit after base64 encoding)
            if (file.size > 4.5 * 1024 * 1024) {
                alert("File is too large! Please choose a file smaller than 4.5MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                if (isEdit) {
                    setEditingFlower({ ...editingFlower, image: reader.result });
                } else {
                    setNewFlower({ ...newFlower, image: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleHeroImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setHeroImageState(reader.result);
                localStorage.setItem('florava_hero_image', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditOpen = (flower) => {
        setEditingFlower(flower);
        setOpenEditModal(true);
    };

    const handleUpdateFlower = () => {
        try {
            const updatedFlowers = flowers.map(f => f.id === editingFlower.id ? {
                ...editingFlower,
                price: parseFloat(editingFlower.price),
                rating: parseFloat(editingFlower.rating)
            } : f);

            const totalSize = JSON.stringify(updatedFlowers).length;
            if (totalSize > 4.8 * 1024 * 1024) {
                alert("Update failed: Catalog would exceed 5MB browser limit. Try a smaller video.");
                return;
            }

            setFlowers(updatedFlowers);
            localStorage.setItem('florava_flowers', JSON.stringify(updatedFlowers));
            setOpenEditModal(false);
            setEditingFlower(null);
        } catch (e) {
            console.error("Failed to update flower:", e);
            alert("Storage limit exceeded! Browser allows only 5MB total. Try a smaller video.");
        }
    };

    const handleDetailOpen = (flower) => {
        setSelectedFlower(flower);
        setOpenDetailModal(true);
    };

    const handleDetailClose = () => {
        setOpenDetailModal(false);
        setSelectedFlower(null);
    };

    const bestsellerFlower = flowers.find(f => f.id === bestsellerId) || initialFlowers[3];
    const trendingFlowers = flowers.filter(f => trendingIds.includes(f.id));

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fff' }}>
            {isAdmin && (
                <Box sx={{
                    bgcolor: '#1e293b',
                    color: '#fff',
                    py: 1.5,
                    px: { xs: 2, md: 3 },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 1.5,
                    zIndex: 1200
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>ADMIN CONTROL PANEL</Typography>
                        <Chip label="ACTIVE" size="small" sx={{ height: 18, fontSize: '9px', fontWeight: 900, bgcolor: '#10b981', color: '#fff' }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<Plus size={14} />}
                            onClick={() => setOpenAddModal(true)}
                            sx={{ bgcolor: '#3d5a3e', '&:hover': { bgcolor: '#2c422d' }, textTransform: 'none', fontSize: '0.75rem', fontWeight: 700 }}
                        >
                            Add New Handcrafted Flower
                        </Button>
                    </Box>
                </Box>
            )}
            <Navbar />

            <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
                {/* Main Hero Section */}
                <Box sx={{ flexGrow: 1 }}>
                    <Box
                        sx={{
                            bgcolor: '#f8fafc',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            position: 'relative',
                            minHeight: '440px',
                            display: 'flex',
                            alignItems: 'center',
                            px: { xs: 3, md: 6 },
                            py: { xs: 6, md: 0 }
                        }}
                    >
                        <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ textAlign: 'center' }}>
                            <Grid item xs={12} md={8}>
                                <Box sx={{ position: 'relative', zIndex: 1 }}>

                                    {isAdmin ? (
                                        <TextField
                                            fullWidth
                                            multiline
                                            variant="standard"
                                            value={heroTitle}
                                            onChange={(e) => {
                                                setHeroTitle(e.target.value);
                                                localStorage.setItem('florava_hero_title', e.target.value);
                                            }}
                                            InputProps={{
                                                style: {
                                                    fontWeight: 700,
                                                    fontSize: '3.5rem',
                                                    lineHeight: 1.2,
                                                    color: '#3d5a3e',
                                                    fontFamily: "'Dancing Script', cursive",
                                                    padding: 0,
                                                    textAlign: 'center'
                                                }
                                            }}
                                            sx={{ mb: 3, '& .MuiInputBase-input': { textAlign: 'center' } }}
                                        />
                                    ) : (
                                        <Typography
                                            variant="h1"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: { xs: '3rem', md: '4.5rem' },
                                                lineHeight: 1.2,
                                                color: '#3d5a3e',
                                                mb: 3,
                                                fontFamily: "'Dancing Script', cursive",
                                                textAlign: 'center'
                                            }}
                                        >
                                            {heroTitle}
                                        </Typography>
                                    )}

                                    {isAdmin ? (
                                        <TextField
                                            fullWidth
                                            multiline
                                            variant="standard"
                                            value={heroSubtitle}
                                            onChange={(e) => {
                                                setHeroSubtitle(e.target.value);
                                                localStorage.setItem('florava_hero_subtitle', e.target.value);
                                            }}
                                            InputProps={{
                                                style: {
                                                    fontSize: '1.25rem',
                                                    color: '#475569',
                                                    lineHeight: 1.8,
                                                    letterSpacing: '0.015em',
                                                    padding: 0,
                                                    textAlign: 'center'
                                                }
                                            }}
                                            sx={{ mb: 4, maxWidth: '700px', mx: 'auto', '& .MuiInputBase-input': { textAlign: 'center' } }}
                                        />
                                    ) : (
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontSize: '1.25rem',
                                                color: '#475569',
                                                lineHeight: 1.8,
                                                letterSpacing: '0.015em',
                                                mb: 4,
                                                maxWidth: '700px',
                                                mx: 'auto',
                                                fontWeight: 400,
                                                textAlign: 'center'
                                            }}
                                        >
                                            {heroSubtitle}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={10}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: { xs: 'column', md: 'row' },
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: { xs: 4, md: 8 }
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            cursor: isAdmin ? 'pointer' : 'default',
                                            '&:hover .hero-overlay': { opacity: isAdmin ? 1 : 0 }
                                        }}
                                        component={isAdmin ? 'label' : 'div'}
                                    >
                                        {isAdmin && (
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleHeroImageChange}
                                            />
                                        )}
                                        <Box
                                            component="img"
                                            src={heroImageState}
                                            alt="Hero Flower Arrangement"
                                            sx={{
                                                width: '100%',
                                                maxWidth: { xs: '320px', md: 'auto' },
                                                height: { xs: 'auto', md: '400px' },
                                                maxHeight: { xs: '280px', md: '400px' },
                                                borderRadius: '12px',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                                                zIndex: 1,
                                                position: 'relative',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        {isAdmin && (
                                            <Box
                                                className="hero-overlay"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    bgcolor: 'rgba(0,0,0,0.4)',
                                                    borderRadius: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: 0,
                                                    transition: 'opacity 0.2s',
                                                    zIndex: 2,
                                                    color: '#fff',
                                                    gap: 1
                                                }}
                                            >
                                                <Upload size={24} />
                                                <Typography sx={{ fontWeight: 700 }}>Change Photo</Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Weekly Bestseller Highlight Area */}
                                    <Box sx={{ zIndex: 2, flexShrink: 0, width: '220px' }}>
                                        <Typography variant="overline" sx={{ color: '#3d5a3e', fontWeight: 800, mb: 1, display: 'block', letterSpacing: '2px', fontFamily: "'Dancing Script', cursive", fontSize: '1.1rem', textTransform: 'none' }}>
                                            Weekly Bestseller
                                        </Typography>

                                        <Box
                                            sx={{
                                                bgcolor: '#fff',
                                                borderRadius: '20px',
                                                p: 2,
                                                boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                                                border: '1px solid #f1f5f9',
                                                mb: 4,
                                                position: 'relative',
                                                transition: 'transform 0.3s ease',
                                                cursor: 'pointer',
                                                '&:hover': { transform: 'translateY(-5px)' }
                                            }}
                                            onClick={() => bestsellerFlower && handleDetailOpen(bestsellerFlower)}
                                        >
                                            <Box sx={{ width: '100%', height: '140px', mb: 2, borderRadius: '14px', overflow: 'hidden', bgcolor: '#f8fafc' }}>
                                                {bestsellerFlower?.image && (bestsellerFlower.image.startsWith('data:video/') || bestsellerFlower.image.match(/\.(mp4|webm|ogg)$/i)) ? (
                                                    <Box
                                                        component="video"
                                                        src={bestsellerFlower.image}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <Box
                                                        component="img"
                                                        src={bestsellerFlower?.image || pinkRosesImg}
                                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                )}
                                            </Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5, fontFamily: "'Dancing Script', cursive", fontSize: '1.4rem' }}>
                                                {bestsellerFlower?.name || 'Velvet Peonies'}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#3d5a3e' }}>
                                                    £{Number(bestsellerFlower?.price || 0).toFixed(2)}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                                    ★ 4.9
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Button
                                            variant="contained"
                                            onClick={handleExplore}
                                            sx={{
                                                width: '100%',
                                                bgcolor: '#1e293b',
                                                color: '#fff',
                                                py: 1.5,
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                fontSize: '0.95rem',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 1,
                                                boxShadow: '0 8px 16px rgba(30, 41, 59, 0.15)',
                                                '&:hover': {
                                                    bgcolor: '#0f172a',
                                                    boxShadow: '0 12px 20px rgba(30, 41, 59, 0.25)',
                                                }
                                            }}
                                        >
                                            Shop Collection <ArrowRight size={16} />
                                        </Button>
                                    </Box>

                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '100%',
                                            height: '120%',
                                            bgcolor: '#e8f0e2',
                                            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                                            zIndex: 0,
                                            opacity: 0.6
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Why Choose Us - Section to fill space */}
                    <Box sx={{ mt: 8, mb: 10, px: 2 }}>
                        <Grid container spacing={4} justifyContent="center">
                            {[
                                { title: 'Artisan Quality', desc: 'Every flower is uniquely handmade', icon: '🎨' },
                                { title: 'Infinite Life', desc: 'Blooms that stay vibrant forever', icon: '♾️' },
                                { title: 'Bespoke Designs', desc: 'Customized to your artistic vision', icon: '✨' },
                                { title: 'Sustainable Art', desc: 'Crafted with passion and care', icon: '🌱' }
                            ].map((feature, idx) => (
                                <Grid item xs={12} sm={6} md={3} key={idx}>
                                    <Box sx={{
                                        textAlign: 'center',
                                        p: 3,
                                        borderRadius: '16px',
                                        bgcolor: '#fff',
                                        border: '1px solid #f1f5f9',
                                        height: '100%',
                                        transition: '0.3s',
                                        '&:hover': { transform: 'translateY(-5px)', borderColor: '#3d5a3e' }
                                    }}>
                                        <Typography variant="h3" sx={{ mb: 2 }}>{feature.icon}</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1e293b', fontFamily: "'Dancing Script', cursive", fontSize: '1.5rem' }}>{feature.title}</Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b' }}>{feature.desc}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Trending Collection Section - 5 cards per row */}
                    <Box sx={{ mb: 8 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6, textAlign: 'center' }}>
                            <Box sx={{ position: 'relative', width: '100%' }}>
                                <Typography variant="overline" sx={{ color: '#3d5a3e', fontWeight: 800, letterSpacing: '2px', fontFamily: "'Dancing Script', cursive", fontSize: '1.1rem', textTransform: 'none', display: 'block' }}>
                                    Our Collection
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mt: 0.5, fontFamily: "'Dancing Script', cursive", fontSize: '2.5rem' }}>
                                    Trending This Week
                                </Typography>
                                <Button
                                    onClick={handleExplore}
                                    sx={{
                                        position: { xs: 'relative', md: 'absolute' },
                                        right: { md: 0 },
                                        top: { md: '50%' },
                                        transform: { md: 'translateY(-50%)' },
                                        mt: { xs: 2, md: 0 },
                                        color: '#3d5a3e',
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                    }}
                                >
                                    View All Collection
                                </Button>
                            </Box>
                        </Box>

                        <Grid container spacing={2} columns={10}>
                            {trendingFlowers.slice(0, 10).map((flower, index) => (
                                <Grid item xs={10} sm={5} md={2} key={flower.id || index}>
                                    <FlowerCard
                                        flower={flower}
                                        isAdmin={isAdmin}
                                        onRemove={handleRemoveFlower}
                                        onSetBestseller={handleSetBestseller}
                                        onToggleTrending={handleToggleTrending}
                                        onEdit={handleEditOpen}
                                        onClick={handleDetailOpen}
                                        isTrending={trendingIds.includes(flower.id)}
                                        isBestseller={bestsellerId === flower.id}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {/* If trending is empty, show a message for admin */}
                        {isAdmin && trendingFlowers.length === 0 && (
                            <Box sx={{ py: 6, textAlign: 'center', border: '2px dashed #e2e8f0', borderRadius: '16px' }}>
                                <Typography variant="body2" color="text.secondary">No flowers selected for trending. Pin some items below or and add from catalog.</Typography>
                            </Box>
                        )}

                        {/* Full Catalog Section - Visible to both customers and admins */}
                        <Box sx={{ mt: 10, textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 4, fontFamily: "'Dancing Script', cursive", fontSize: '2.5rem' }}>
                                Full Collection
                            </Typography>
                            <Grid container spacing={2} columns={10}>
                                {flowers.slice((currentPageCollection - 1) * ITEMS_PER_PAGE, currentPageCollection * ITEMS_PER_PAGE).map((flower) => (
                                    <Grid item xs={10} sm={5} md={2} key={flower.id}>
                                        <FlowerCard
                                            flower={flower}
                                            isAdmin={isAdmin}
                                            onRemove={handleRemoveFlower}
                                            onSetBestseller={handleSetBestseller}
                                            onToggleTrending={handleToggleTrending}
                                            onEdit={handleEditOpen}
                                            onClick={handleDetailOpen}
                                            isTrending={trendingIds.includes(flower.id)}
                                            isBestseller={bestsellerId === flower.id}
                                        />
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Pagination for Full Collection */}
                            {flowers.length > ITEMS_PER_PAGE && (
                                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                                    <Pagination
                                        count={Math.ceil(flowers.length / ITEMS_PER_PAGE)}
                                        page={currentPageCollection}
                                        onChange={(e, value) => {
                                            setCurrentPageCollection(value);
                                        }}
                                        size="small"
                                        variant="outlined"
                                        shape="rounded"
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                fontWeight: 700,
                                                borderRadius: '8px',
                                                borderColor: '#e2e8f0',
                                                '&.Mui-selected': {
                                                    bgcolor: '#3d5a3e',
                                                    color: '#fff',
                                                    borderColor: '#3d5a3e',
                                                    '&:hover': { bgcolor: '#2c422d' }
                                                }
                                            }
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Container>

            {/* Add Flower Modal */}
            <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>Add Handcrafted Flower</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                        <TextField
                            label="Flower Name"
                            fullWidth
                            value={newFlower.name}
                            onChange={(e) => setNewFlower({ ...newFlower, name: e.target.value })}
                        />
                        <TextField
                            label="Price"
                            type="number"
                            fullWidth
                            value={newFlower.price}
                            onChange={(e) => setNewFlower({ ...newFlower, price: e.target.value })}
                        />
                        <TextField
                            label="SKU / Code"
                            fullWidth
                            value={newFlower.sku}
                            onChange={(e) => setNewFlower({ ...newFlower, sku: e.target.value })}
                        />
                        <TextField
                            label="Initial Rating (0-5)"
                            type="number"
                            fullWidth
                            inputProps={{ step: 0.1, min: 0, max: 5 }}
                            value={newFlower.rating}
                            onChange={(e) => setNewFlower({ ...newFlower, rating: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            multiline
                            rows={3}
                            fullWidth
                            value={newFlower.description}
                            onChange={(e) => setNewFlower({ ...newFlower, description: e.target.value })}
                        />
                        <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, mb: 1, display: 'block' }}>
                                Flower Media (Image or Video)
                            </Typography>
                            <Box
                                sx={{
                                    border: '2px dashed #e2e8f0',
                                    borderRadius: '12px',
                                    p: 2,
                                    textAlign: 'center',
                                    bgcolor: '#f8fafc',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    '&:hover': { borderColor: '#3d5a3e', bgcolor: '#f0f4f0' }
                                }}
                                component="label"
                            >
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*,video/*"
                                    onChange={handleFileChange}
                                />
                                {newFlower.image ? (
                                    <Box sx={{ position: 'relative' }}>
                                        {newFlower.image.startsWith('data:video/') || newFlower.image.match(/\.(mp4|webm|ogg)$/i) ? (
                                            <Box
                                                component="video"
                                                src={newFlower.image}
                                                autoPlay
                                                loop
                                                muted
                                                sx={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        ) : (
                                            <Box
                                                component="img"
                                                src={newFlower.image}
                                                sx={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        )}
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            bgcolor: 'rgba(0,0,0,0.3)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0,
                                            transition: 'opacity 0.2s',
                                            '&:hover': { opacity: 1 }
                                        }}>
                                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700 }}>Change Media</Typography>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box sx={{ py: 2 }}>
                                        <Upload size={24} color="#64748b" style={{ marginBottom: '8px' }} />
                                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>Click to upload media (Image or Video)</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <TextField
                            label="Label / Badge"
                            select
                            fullWidth
                            value={newFlower.badge}
                            onChange={(e) => setNewFlower({ ...newFlower, badge: e.target.value })}
                        >
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="New">New</MenuItem>
                            <MenuItem value="Popular">Popular</MenuItem>
                            <MenuItem value="Limited">Limited</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenAddModal(false)} sx={{ color: '#64748b', textTransform: 'none' }}>Cancel</Button>
                    <Button
                        onClick={handleAddFlower}
                        variant="contained"
                        disabled={!newFlower.name || !newFlower.price || !newFlower.image}
                        sx={{ bgcolor: '#3d5a3e', '&:hover': { bgcolor: '#2c422d' }, textTransform: 'none', px: 4 }}
                    >
                        Create Flower
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Flower Modal */}
            <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 800, color: '#3d5a3e', fontFamily: "'Dancing Script', cursive", fontSize: '2rem' }}>Edit Flower Details</DialogTitle>
                <DialogContent>
                    {editingFlower && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                            <TextField
                                label="Flower Name"
                                fullWidth
                                value={editingFlower.name}
                                onChange={(e) => setEditingFlower({ ...editingFlower, name: e.target.value })}
                            />
                            <TextField
                                label="Price"
                                type="number"
                                fullWidth
                                value={editingFlower.price}
                                onChange={(e) => setEditingFlower({ ...editingFlower, price: e.target.value })}
                            />
                            <TextField
                                label="SKU / Code"
                                fullWidth
                                value={editingFlower.sku}
                                onChange={(e) => setEditingFlower({ ...editingFlower, sku: e.target.value })}
                            />
                            <TextField
                                label="Rating (0-5)"
                                type="number"
                                fullWidth
                                inputProps={{ step: 0.1, min: 0, max: 5 }}
                                value={editingFlower.rating}
                                onChange={(e) => setEditingFlower({ ...editingFlower, rating: e.target.value })}
                            />
                            <TextField
                                label="Description"
                                multiline
                                rows={3}
                                fullWidth
                                value={editingFlower.description}
                                onChange={(e) => setEditingFlower({ ...editingFlower, description: e.target.value })}
                            />

                            <Box>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, mb: 1, display: 'block' }}>
                                    Flower Media
                                </Typography>
                                <Box
                                    sx={{
                                        border: '2px dashed #e2e8f0',
                                        borderRadius: '12px',
                                        p: 2,
                                        textAlign: 'center',
                                        bgcolor: '#f8fafc',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        '&:hover': { borderColor: '#3d5a3e', bgcolor: '#f0f4f0' }
                                    }}
                                    component="label"
                                >
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*,video/*"
                                        onChange={(e) => handleFileChange(e, true)}
                                    />
                                    <Box sx={{ position: 'relative' }}>
                                        {editingFlower.image && (editingFlower.image.startsWith('data:video/') || editingFlower.image.match(/\.(mp4|webm|ogg)$/i)) ? (
                                            <Box
                                                component="video"
                                                src={editingFlower.image}
                                                autoPlay
                                                loop
                                                muted
                                                sx={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        ) : (
                                            <Box
                                                component="img"
                                                src={editingFlower.image}
                                                sx={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        )}
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            bgcolor: 'rgba(0,0,0,0.3)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0,
                                            transition: 'opacity 0.2s',
                                            '&:hover': { opacity: 1 }
                                        }}>
                                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700 }}>Update Media</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <TextField
                                label="Label / Badge"
                                select
                                fullWidth
                                value={editingFlower.badge || ''}
                                onChange={(e) => setEditingFlower({ ...editingFlower, badge: e.target.value })}
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value="New">New</MenuItem>
                                <MenuItem value="Popular">Popular</MenuItem>
                                <MenuItem value="Limited">Limited</MenuItem>
                            </TextField>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenEditModal(false)} sx={{ color: '#64748b', textTransform: 'none' }}>Cancel</Button>
                    <Button
                        onClick={handleUpdateFlower}
                        variant="contained"
                        sx={{ bgcolor: '#3d5a3e', '&:hover': { bgcolor: '#2c422d' }, textTransform: 'none', px: 4 }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Product Detail Modal */}
            <Dialog
                open={openDetailModal}
                onClose={handleDetailClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '24px', overflow: 'hidden' }
                }}
            >
                {selectedFlower && (
                    <Box sx={{ position: 'relative', display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                        <IconButton
                            onClick={handleDetailClose}
                            sx={{
                                position: 'absolute',
                                right: 16,
                                top: 16,
                                zIndex: 10,
                                bgcolor: 'rgba(255,255,255,0.8)',
                                '&:hover': { bgcolor: '#fff' }
                            }}
                        >
                            <X size={20} />
                        </IconButton>

                        <Box sx={{ flex: 1, minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8fafc' }}>
                            {selectedFlower?.image && (selectedFlower.image.startsWith('data:video/') || selectedFlower.image.match(/\.(mp4|webm|ogg)$/i)) ? (
                                <Box
                                    component="video"
                                    src={selectedFlower.image}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <Box
                                    component="img"
                                    src={selectedFlower?.image}
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            )}
                        </Box>

                        <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mb: 1, letterSpacing: '1px' }}>
                                SKU: {selectedFlower?.sku}
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#1e293b', fontFamily: "'Dancing Script', cursive", fontSize: '2.5rem' }}>
                                {selectedFlower?.name}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: '#3d5a3e' }}>
                                    £{Number(selectedFlower?.price || 0).toFixed(2)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: '8px' }}>
                                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                                    <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{selectedFlower?.rating}</Typography>
                                </Box>
                            </Box>

                            <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.7, mb: 4 }}>
                                {selectedFlower?.description || `Handcrafted with love and precision. This ${selectedFlower?.name} arrangement features premium materials designed to last forever. Perfect for gifting or home decoration.`}
                            </Typography>

                        </Box>
                    </Box>
                )}
            </Dialog>

            <Footer isAdmin={isAdmin} />
        </Box>
    );
};

export default CustomerLandingPage;
