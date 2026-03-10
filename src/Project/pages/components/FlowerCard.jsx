import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, IconButton, Button, Chip, Rating, Tooltip } from '@mui/material';
import { Trash2, Star, TrendingUp, Check, Pencil } from 'lucide-react';


const FlowerCard = ({
    flower,
    isAdmin = false,
    onRemove,
    onSetBestseller,
    onToggleTrending,
    isTrending = false,
    isBestseller = false,
    onEdit,
    onClick
}) => {
    const { id, image, name, price, rating, sku, badge, badgeColor } = flower;

    return (
        <Card
            elevation={0}
            onClick={() => onClick && onClick(flower)}
            sx={{
                position: 'relative',
                height: '420px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                border: '1px solid #f0f0f0',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.06)'
                }
            }}
        >
            {/* Admin Actions Overlay */}
            {isAdmin && (
                <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Tooltip title="Remove Product" placement="left">
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); onRemove(id); }}
                            sx={{ bgcolor: 'rgba(239, 68, 68, 0.9)', color: '#fff', '&:hover': { bgcolor: '#ef4444' } }}
                        >
                            <Trash2 size={16} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit Product" placement="left">
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); onEdit(flower); }}
                            sx={{ bgcolor: 'rgba(59, 130, 246, 0.9)', color: '#fff', '&:hover': { bgcolor: '#2563eb' } }}
                        >
                            <Pencil size={16} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={isBestseller ? "Current Bestseller" : "Set as Bestseller"} placement="left">
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); onSetBestseller(id); }}
                            sx={{
                                bgcolor: isBestseller ? 'rgba(234, 179, 8, 0.9)' : 'rgba(255,255,255,0.9)',
                                color: isBestseller ? '#fff' : '#eea300',
                                '&:hover': { bgcolor: isBestseller ? '#ca8a04' : '#fff' }
                            }}
                        >
                            <Star size={16} fill={isBestseller ? "currentColor" : "none"} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={isTrending ? "Remove from Trending" : "Add to Trending"} placement="left">
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); onToggleTrending(id); }}
                            sx={{
                                bgcolor: isTrending ? 'rgba(16, 185, 129, 0.9)' : 'rgba(255,255,255,0.9)',
                                color: isTrending ? '#fff' : '#10b981',
                                '&:hover': { bgcolor: isTrending ? '#059669' : '#fff' }
                            }}
                        >
                            {isTrending ? <Check size={16} /> : <TrendingUp size={16} />}
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            {/* Badge */}
            {badge && (
                <Chip
                    label={badge.toUpperCase()}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 1,
                        fontWeight: 700,
                        fontSize: '10px',
                        bgcolor: badgeColor || '#3d5a3e',
                        color: '#fff',
                        borderRadius: '6px',
                        height: 22
                    }}
                />
            )}

            {/* Media (Image or Video) */}
            <Box sx={{ height: 280, position: 'relative', overflow: 'hidden', bgcolor: '#f8fafc' }}>
                {image && (image.startsWith('data:video/') || image.match(/\.(mp4|webm|ogg)$/i)) ? (
                    <Box
                        component="video"
                        src={image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    <CardMedia
                        component="img"
                        image={image}
                        alt={name}
                        sx={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover'
                        }}
                    />
                )}
            </Box>

            <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>
                    SKU: {sku}
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: '#1e293b',
                        fontSize: '1.4rem',
                        fontFamily: "'Dancing Script', cursive",
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {name}
                </Typography>

                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#3d5a3e' }}>
                        £{Number(price).toFixed(2)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Rating value={Number(rating)} precision={0.1} readOnly size="small" />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            {rating}
                        </Typography>
                    </Box>
                </Box>

            </CardContent>
        </Card>
    );
};

export default FlowerCard;
