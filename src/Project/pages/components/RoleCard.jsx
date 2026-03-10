import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Box,
    styled
} from '@mui/material';
import { ArrowRight } from 'lucide-react';

const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 400,
    minHeight: { xs: 'auto', md: 420 },
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 16,
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: theme.shadows[10],
    },
}));

const BadgeWrapper = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
}));

const RoleCard = ({
    image,
    roleLabel,
    title,
    description,
    buttonText,
    onAction,
    badgeColor = "default"
}) => {
    return (
        <StyledCard onClick={onAction}>
            <Box sx={{ position: 'relative' }}>
                <BadgeWrapper>
                    <Chip
                        label={roleLabel}
                        color={badgeColor}
                        sx={{ fontWeight: 'bold', borderRadius: 1 }}
                    />
                </BadgeWrapper>
                <CardMedia
                    component="img"
                    height="180"
                    image={image}
                    alt={title}
                />
            </Box>
            <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold', fontFamily: "'Dancing Script', cursive", fontSize: '1.8rem' }}>
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    {description}
                </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowRight size={18} />}
                    onClick={(e) => {
                        e.stopPropagation();
                        onAction();
                    }}
                    sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem'
                    }}
                >
                    {buttonText}
                </Button>
            </CardActions>
        </StyledCard>
    );
};

export default RoleCard;
