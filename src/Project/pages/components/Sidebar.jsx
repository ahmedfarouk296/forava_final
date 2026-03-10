import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Slider, Chip } from '@mui/material';
import { Flower2, Leaf, Sun, Wind, CloudSun } from 'lucide-react';

const Sidebar = () => {
    const [priceRange, setPriceRange] = React.useState([10, 200]);

    const categories = [
        { name: 'Roses', icon: <Leaf size={18} />, active: true },
        { name: 'Tulips', icon: <Flower2 size={18} /> },
        { name: 'Orchids', icon: <Wind size={18} /> },
        { name: 'Sunflowers', icon: <Sun size={18} /> },
        { name: 'Seasonal', icon: <CloudSun size={18} /> },
    ];

    const colors = [
        { name: 'Pink', bg: '#ffe4e6', color: '#e11d48' },
        { name: 'Red', bg: '#fee2e2', color: '#dc2626' },
        { name: 'White', bg: '#f3f4f6', color: '#4b5563' },
        { name: 'Yellow', bg: '#fef3c7', color: '#d97706' },
    ];

    return (
        <Box sx={{ width: 220, pr: 2, flexShrink: 0, display: { xs: 'none', lg: 'block' } }}>
            {/* Categories */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="overline" sx={{ fontWeight: 700, color: '#999', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                    CATEGORIES
                </Typography>
                <List sx={{ mt: 0.5 }}>
                    {categories.map((cat) => (
                        <ListItem
                            key={cat.name}
                            disableGutters
                            sx={{
                                py: 0.5,
                                px: 1.5,
                                mb: 0.5,
                                borderRadius: '6px',
                                bgcolor: cat.active ? '#f0f4f0' : 'transparent',
                                color: cat.active ? '#3d5a3e' : '#666',
                                '&:hover': { bgcolor: '#f5f5f5' },
                                cursor: 'pointer'
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                                {React.cloneElement(cat.icon, { size: 16 })}
                            </ListItemIcon>
                            <ListItemText
                                primary={cat.name}
                                primaryTypographyProps={{ fontWeight: cat.active ? 600 : 500, fontSize: '0.85rem' }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Price Range */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="overline" sx={{ fontWeight: 700, color: '#999', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                    PRICE RANGE
                </Typography>
                <Box sx={{ px: 1, mt: 2 }}>
                    <Slider
                        value={priceRange}
                        onChange={(e, newValue) => setPriceRange(newValue)}
                        valueLabelDisplay="auto"
                        size="small"
                        min={10}
                        max={200}
                        sx={{ color: '#8fb397' }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#666' }}>$10</Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>$200+</Typography>
                    </Box>
                </Box>
            </Box>

            {/* Colors */}
            <Box>
                <Typography variant="overline" sx={{ fontWeight: 700, color: '#999', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                    COLORS
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
                    {colors.map((color) => (
                        <Chip
                            key={color.name}
                            label={color.name}
                            size="small"
                            sx={{
                                bgcolor: color.bg,
                                color: color.color,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                borderRadius: '5px',
                                height: 24,
                                '&:hover': { opacity: 0.8 }
                            }}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default Sidebar;
