import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    Divider,
    Alert,
    CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import api from '../utils/api';
import { UserResponseDto, UpdateUserDto } from '@al-jns/contracts';
import './Profile.css';



export function Profile() {
    const [user, setUser] = useState<UserResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState<UpdateUserDto>({
        name: '',
        email: '',
        telegramId: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get<UserResponseDto>(`/users/me`);
            setUser(response.data);
            setFormData({
                name: response.data.name || '',
                email: response.data.email || '',
                telegramId: response.data.telegramId || ''
            });
        } catch (err: any) {
            setError('Failed to fetch profile info.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);
            const response = await api.patch<UserResponseDto>(`/users/me`, formData);
            setUser(response.data);
            setSuccess('Profile updated successfully!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="profile-container">
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1e293b' }}>
                User Profile
            </Typography>

            <Paper elevation={0} className="profile-paper">
                <Box className="profile-header">
                    <Avatar sx={{ width: 80, height: 80, bgcolor: '#4f46e5', mb: 2 }}>
                        <PersonIcon sx={{ fontSize: 50 }} />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                        {user?.name || 'User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user?.email}
                    </Typography>
                </Box>

                <Divider sx={{ my: 4 }} />

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Telegram ID"
                            name="telegramId"
                            value={formData.telegramId}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            placeholder="e.g. @username or ID"
                            helperText="Used for notifications and bot interaction"
                        />

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                disabled={saving}
                                sx={{
                                    bgcolor: '#4f46e5',
                                    '&:hover': { bgcolor: '#4338ca' },
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontSize: '16px'
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
