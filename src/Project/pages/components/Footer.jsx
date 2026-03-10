import React from 'react';
import { Box, Container, Grid, Typography, TextField, IconButton, Link } from '@mui/material';
import { Facebook, Twitter, Instagram, Linkedin, Send, Mail, MapPin, Phone, Music } from 'lucide-react';
import logoImage from '../../images/logo.PNG';

const Footer = () => {
    return (
        <Box sx={{ bgcolor: '#0f172a', color: '#94a3b8', pt: 6, pb: 4 }}>
            <Container maxWidth="xl">
                <Grid container spacing={{ xs: 6, md: 8 }}>
                    {/* Left Side: Brand, Mission, Socials */}
                    <Grid item xs={12} md={5} sx={{ pr: { md: 12 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: 'center' }}>
                            <Box
                                component="img"
                                src={logoImage}
                                alt="Florava"
                                sx={{ height: 50, width: 50, borderRadius: '50%', border: '1px solid #334155' }}
                            />
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', fontFamily: "'Dancing Script', cursive", fontSize: '2.5rem' }}>
                                Florava
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '0.95rem', maxWidth: '480px', mb: 4, color: '#94a3b8', textAlign: 'center', mx: 'auto' }}>
                            Crafting beautiful moments with the finest blooms. We deliver freshness, quality, and joy with every bouquet.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            {[
                                { icon: <Facebook size={20} />, action: () => alert('Coming Soon!') },
                                { icon: <Twitter size={20} />, action: () => alert('Coming Soon!') },
                                { icon: <Instagram size={20} />, link: "https://www.instagram.com/florava.eg?igsh=MWVtNG9ycWt6ZnU3dQ==" },
                                { icon: <Music size={20} />, link: "https://www.tiktok.com/@florava76?_r=1&_t=ZS-94YVKBuZdrR" }
                            ].map((item, index) => (
                                <IconButton
                                    key={index}
                                    size="medium"
                                    onClick={item.action}
                                    component={item.link ? "a" : "button"}
                                    href={item.link}
                                    target={item.link ? "_blank" : undefined}
                                    rel={item.link ? "noopener noreferrer" : undefined}
                                    sx={{
                                        color: '#94a3b8',
                                        bgcolor: 'rgba(255,255,255,0.03)',
                                        border: '1px solid #1e293b',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { bgcolor: '#1e293b', color: '#fff', transform: 'translateY(-3px)' }
                                    }}
                                >
                                    {item.icon}
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {/* Middle: Our Promise */}
                    <Grid item xs={12} md={5} sx={{ pr: { md: 24 }, textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, mb: 4, fontFamily: "'Dancing Script', cursive", fontSize: '2rem', textAlign: 'center' }}>
                            Our Promise
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', bgcolor: 'rgba(143, 179, 151, 0.1)' }}>
                                    <Send size={16} color="#8fb397" />
                                </Box>
                                <Typography sx={{ fontSize: '0.95rem', color: '#94a3b8' }}>100% Handcrafted Art</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', bgcolor: 'rgba(143, 179, 151, 0.1)' }}>
                                    <Phone size={16} color="#8fb397" />
                                </Box>
                                <Typography sx={{ fontSize: '0.95rem', color: '#94a3b8' }}>Customizable Gift Box</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', bgcolor: 'rgba(143, 179, 151, 0.1)' }}>
                                    <Mail size={16} color="#8fb397" />
                                </Box>
                                <Typography sx={{ fontSize: '0.95rem', color: '#94a3b8' }}>Everlasting Freshness</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Side: Contact Details */}
                    <Grid item xs={12} md={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, mb: 4, fontFamily: "'Dancing Script', cursive", fontSize: '2rem', textAlign: 'center' }}>
                            Contact Us
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <MapPin size={22} color="#fff" />
                                <Typography sx={{ fontSize: '1rem', color: '#94a3b8' }}>Alexandria, Egypt</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Instagram size={22} color="#fff" />
                                <Link
                                    href="https://www.instagram.com/florava.eg?igsh=MWVtNG9ycWt6ZnU3dQ=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1rem', '&:hover': { color: '#fff' } }}
                                >
                                    @florava.eg
                                </Link>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* Horizontal Divider Line */}
                <Box sx={{ mt: 8, mb: 4, borderTop: '1px solid rgba(255,255,255,0.05)' }} />

                {/* Bottom Bar: Copyright & Credits */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 3
                }}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                        © 2026 Florava. Handcrafted with love and pipe cleaner artistry.
                    </Typography>

                    <Box
                        component="a"
                        href="https://www.instagram.com/vivido.eg?igsh=MWw1bDNrbXFia3E3cg=="
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            textDecoration: 'none',
                            color: '#fff',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.5px',
                            transition: 'opacity 0.3s ease',
                            '&:hover': { opacity: 0.8 }
                        }}
                    >
                        DEVELOPED BY
                        <Typography component="span" sx={{ color: '#3b82f6', ml: 0.5, fontWeight: 800, fontSize: '0.75rem' }}>
                            VIVIDO AGENCY
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
