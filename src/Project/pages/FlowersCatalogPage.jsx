import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Pagination, ToggleButton, ToggleButtonGroup, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button, IconButton } from '@mui/material';
import { LayoutGrid, List as ListIcon, X, Star } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FlowerCard from './components/FlowerCard';

// Import local images
import pinkRosesImg from '../images/pink_roses.png';
import yellowTulipsImg from '../images/yellow_tulips.png';
import sunflowersImg from '../images/sunflowers.png';

const FlowersCatalogPage = () => {
    const location = useLocation();
    const isAdmin = new URLSearchParams(location.search).get('admin') === 'true' && localStorage.getItem('florava_admin_logged_in') === 'true';
    const [view, setView] = useState('grid');
    const [flowers, setFlowers] = useState([]);
    const [bestsellerId, setBestsellerId] = useState(null);
    const [trendingIds, setTrendingIds] = useState([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingFlower, setEditingFlower] = useState(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedFlower, setSelectedFlower] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
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

        const savedFlowers = localStorage.getItem('florava_flowers');
        const savedBestseller = localStorage.getItem('florava_bestseller');
        const savedTrending = localStorage.getItem('florava_trending');

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

        if (savedBestseller) setBestsellerId(savedBestseller);

        if (savedTrending) {
            try {
                const parsed = JSON.parse(savedTrending);
                if (Array.isArray(parsed)) setTrendingIds(parsed);
                else setTrendingIds([]);
            } catch (e) {
                setTrendingIds([]);
            }
        }
    }, []);

    // Admin Actions
    const handleRemoveFlower = (id) => {
        const updatedFlowers = flowers.filter(f => f.id !== id);
        setFlowers(updatedFlowers);
        localStorage.setItem('florava_flowers', JSON.stringify(updatedFlowers));
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 4.5MB for demo purposes)
            if (file.size > 4.5 * 1024 * 1024) {
                alert("File is too large! Please choose a file smaller than 4.5MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingFlower({ ...editingFlower, image: reader.result });
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
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>CATALOG MANAGEMENT MODE</Typography>
                        <Chip label="ACTIVE" size="small" sx={{ height: 18, fontSize: '9px', fontWeight: 900, bgcolor: '#10b981', color: '#fff' }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>Real-time updates to Landing Page</Typography>
                </Box>
            )}
            <Navbar />

            <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
                {/* Main Content - Sidebar Removed */}
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        mb: 6,
                        gap: 1
                    }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 0.5, fontFamily: "'Dancing Script', cursive", fontSize: '2rem' }}>
                            Featured Flowers
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                            Showing {Math.min(ITEMS_PER_PAGE, flowers.length - (currentPage - 1) * ITEMS_PER_PAGE)} of {flowers.length} results
                        </Typography>
                    </Box>

                    <Grid container spacing={2} columns={10}>
                        {flowers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((flower, index) => (
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

                    {/* Pagination */}
                    {flowers.length > ITEMS_PER_PAGE && (
                        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                count={Math.ceil(flowers.length / ITEMS_PER_PAGE)}
                                page={currentPage}
                                onChange={(e, value) => {
                                    setCurrentPage(value);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            </Container>

            {/* Edit Flower Modal (Copied from Landing for consistency) */}
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
                                        onChange={handleFileChange}
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

            <Footer />
        </Box>
    );
};

export default FlowersCatalogPage;
