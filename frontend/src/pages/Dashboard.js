import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, PlusCircle, Trash2, Edit2, TrendingUp, Flame, Calendar, X } from 'lucide-react';

// API Configuration
const API_BASE = 'http://localhost:5000/api';

const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'API request failed');
    }
    return response.json();
};

const HabitTrackerDashboard = () => {
    const [habits, setHabits] = useState([]);
    const [quote, setQuote] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        frequency: 'daily',
        goal_duration: 30,
        start_date: new Date().toISOString().slice(0, 10)
    });
    const [weekDates, setWeekDates] = useState([]);
    const [monthDates, setMonthDates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const token = useState(() => localStorage.getItem('token'))[0];

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    const generateCalendarDates = () => {
        const today = new Date();
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - today.getDay());

        const week = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(sunday);
            date.setDate(sunday.getDate() + i);
            week.push({
                date: date.toISOString().slice(0, 10),
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNum: date.getDate()
            });
        }
        setWeekDates(week);

        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const monthArray = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            monthArray.push({
                date: date.toISOString().slice(0, 10),
                day: i
            });
        }
        setMonthDates(monthArray);
    };

    const fetchHabits = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiRequest('/habits', 'GET', null, token);

            const habits = data.habits || [];

            const habitsWithProgress = habits.map(habit => {
                let goalProgress = 0;

                if (habit.start_date && habit.end_date) {
                    const startParts = habit.start_date.split('-');
                    const endParts = habit.end_date.split('-');
                    
                    const start = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));
                    const end = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]));
                    const today = new Date();
                    
                    today.setHours(0, 0, 0, 0);

                    const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

                    let elapsedDays = 0;
                    if (today >= start) {
                        elapsedDays = Math.round((today - start) / (1000 * 60 * 60 * 24)) + 1;
                        elapsedDays = Math.min(elapsedDays, totalDays);
                    }

                    if (totalDays > 0) {
                        goalProgress = Math.round((elapsedDays / totalDays) * 100);
                        goalProgress = Math.max(0, Math.min(100, goalProgress));
                    }
                }

                return {
                    ...habit,
                    goalProgress,
                };
            });

            setHabits(habitsWithProgress);
        } catch (error) {
            console.error('Failed to fetch habits:', error);
            showNotification('Failed to load habits', 'error');
            setHabits([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchQuote = async () => {
        try {
            const response = await fetch(`${API_BASE}/quotes/random`);
            if (response.ok) {
                const data = await response.json();
                setQuote(data.quote || 'Build better habits, one day at a time.');
            } else {
                setQuote('Build better habits, one day at a time.');
            }
        } catch (error) {
            console.error('Failed to fetch quote:', error);
            setQuote('Build better habits, one day at a time.');
        }
    };

    useEffect(() => {
        fetchHabits();
        fetchQuote();
        generateCalendarDates();
    }, [fetchHabits]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'goal_duration') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 30 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            showNotification('Please enter a habit title', 'error');
            return;
        }

        try {
            setLoading(true);
            if (editingHabit) {
                await apiRequest(`/habits/update/${editingHabit.id}`, 'PUT', formData, token);
                showNotification('Habit updated successfully!');
            } else {
                await apiRequest('/habits/add', 'POST', formData, token);
                showNotification('Habit added successfully!');
            }

            setFormData({ 
                title: '', 
                description: '', 
                frequency: 'daily',
                goal_duration: 30,
                start_date: new Date().toISOString().slice(0, 10)
            });
            setIsFormOpen(false);
            setEditingHabit(null);
            fetchHabits();
        } catch (error) {
            console.error('Failed to save habit:', error);
            showNotification(error.message || 'Failed to save habit', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkCompletion = async (habitId) => {
        try {
            const data = await apiRequest('/habits/mark', 'POST', { habitId }, token);

            setHabits(prev => prev.map(h =>
                h.id === habitId ? { ...h, ...data.habit } : h
            ));

            showNotification('Marked for today! 🎉');
        } catch (error) {
            console.error('Failed to mark completion:', error);
            showNotification('Failed to mark completion', 'error');
        }
    };

    const isDateCompleted = (habit, date) => {
        return habit.completedToday && date === new Date().toISOString().slice(0, 10);
    };

    const handleEdit = (habit) => {
        setEditingHabit(habit);
        setFormData({
            title: habit.title,
            description: habit.description || '',
            frequency: habit.frequency || 'daily',
            goal_duration: habit.goal_duration || 30,
            start_date: habit.start_date ? new Date(habit.start_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
        });
        setIsFormOpen(true);
    };

    const handleDelete = async (habitId) => {
        if (!window.confirm('Are you sure you want to delete this habit?')) return;

        try {
            await apiRequest(`/habits/delete/${habitId}`, 'DELETE', null, token);
            showNotification('Habit deleted successfully');
            fetchHabits();
        } catch (error) {
            console.error('Failed to delete habit:', error);
            showNotification('Failed to delete habit', 'error');
        }
    };

    const cancelForm = () => {
        setFormData({ 
            title: '', 
            description: '', 
            frequency: 'daily',
            goal_duration: 30,
            start_date: new Date().toISOString().slice(0, 10)
        });
        setIsFormOpen(false);
        setEditingHabit(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const getStreakEmoji = (streak, frequency) => {
        if (streak === 0) return '💤';
        if (frequency === 'daily') {
            if (streak >= 30) return '🏆';
            if (streak >= 14) return '⭐';
            if (streak >= 7) return '🔥';
        }
        return '✨';
    };

    const getCompletionColor = (pct) => {
        if (pct >= 80) return { bg: '#F5EFE6', text: '#6B4423' };
        if (pct >= 50) return { bg: '#FFF7ED', text: '#8B6F47' };
        return { bg: '#FEF2F2', text: '#991b1b' };
    };

    return (
        <div style={{ minHeight: '100vh', background: '#FFFEF9', padding: '16px', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            <style>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                input:focus, textarea:focus, select:focus { outline: none; box-shadow: 0 0 0 3px rgba(139, 111, 71, 0.2); border-color: #8B6F47; }
            `}</style>

            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Notification Toast */}
                {notification.show && (
                    <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50, animation: 'slide-in 0.3s ease-out' }}>
                        <div style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(139, 111, 71, 0.2)',
                            color: 'white',
                            fontWeight: 600,
                            backgroundColor: notification.type === 'success' ? '#8B6F47' : '#D85D5D'
                        }}>
                            {notification.message}
                        </div>
                    </div>
                )}

                {/* Header */}
                <div style={{ backgroundColor: '#FFFEF9', border: '1px solid #E8DCC8', borderRadius: '12px', boxShadow: '0 4px 12px rgba(139, 111, 71, 0.1)', padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#2C1810', marginBottom: '4px', letterSpacing: '-1px' }}>
                                MindMitr
                            </h1>
                            <p style={{ fontSize: '13px', color: '#6B5B4F', fontWeight: '500' }}>
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#D85D5D',
                                color: '#FFFEF9',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 6px rgba(216, 93, 93, 0.2)'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#C54A4A';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#D85D5D';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            Logout
                        </button>
                    </div>
                    {quote && (
                        <div style={{
                            backgroundColor: '#F5EFE6',
                            borderLeft: '4px solid #8B6F47',
                            padding: '16px',
                            borderTopRightRadius: '8px',
                            borderBottomRightRadius: '8px',
                            color: '#6B4423',
                            fontStyle: 'italic',
                            fontSize: '15px'
                        }}>
                            "{quote}"
                        </div>
                    )}
                </div>

                {/* Stats Overview */}
                {habits.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ backgroundColor: '#FFFEF9', border: '1px solid #E8DCC8', borderRadius: '12px', boxShadow: '0 4px 12px rgba(139, 111, 71, 0.1)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '13px', color: '#6B5B4F', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Habits</p>
                                <p style={{ fontSize: '32px', fontWeight: '800', color: '#8B6F47' }}>{habits.length}</p>
                            </div>
                            <Calendar style={{ width: '48px', height: '48px', color: '#8B6F47', opacity: 0.2 }} />
                        </div>
                        <div style={{ backgroundColor: '#FFFEF9', border: '1px solid #E8DCC8', borderRadius: '12px', boxShadow: '0 4px 12px rgba(139, 111, 71, 0.1)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '13px', color: '#6B5B4F', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completed Today</p>
                                <p style={{ fontSize: '32px', fontWeight: '800', color: '#8B6F47' }}>
                                    {habits.filter(h => h.completedToday).length}
                                </p>
                            </div>
                            <CheckCircle style={{ width: '48px', height: '48px', color: '#8B6F47', opacity: 0.2 }} />
                        </div>
                        <div style={{ backgroundColor: '#FFFEF9', border: '1px solid #E8DCC8', borderRadius: '12px', boxShadow: '0 4px 12px rgba(139, 111, 71, 0.1)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '13px', color: '#6B5B4F', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Completion</p>
                                <p style={{ fontSize: '32px', fontWeight: '800', color: '#8B6F47' }}>
                                    {Math.round(habits.reduce((acc, h) => acc + h.completion_pct, 0) / habits.length)}%
                                </p>
                            </div>
                            <TrendingUp style={{ width: '48px', height: '48px', color: '#8B6F47', opacity: 0.2 }} />
                        </div>
                    </div>
                )}

                {/* Add Habit Button */}
                <button
                    onClick={() => setIsFormOpen(true)}
                    style={{
                        width: '100%',
                        backgroundColor: '#8B6F47',
                        color: '#FFFEF9',
                        border: 'none',
                        padding: '16px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '16px',
                        boxShadow: '0 4px 12px rgba(139, 111, 71, 0.2)',
                        cursor: 'pointer',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#6B4423';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 16px rgba(107, 68, 35, 0.3)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#8B6F47';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(139, 111, 71, 0.2)';
                    }}
                >
                    <PlusCircle style={{ width: '24px', height: '24px' }} />
                    Add New Habit
                </button>

                {/* Add/Edit Habit Modal */}
                {isFormOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(44, 24, 16, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 50,
                        padding: '16px'
                    }}>
                        <div style={{
                            backgroundColor: '#FFFEF9',
                            borderRadius: '16px',
                            boxShadow: '0 25px 50px -12px rgba(139, 111, 71, 0.3)',
                            maxWidth: '500px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            border: '1px solid #E8DCC8'
                        }}>
                            {/* Modal Header */}
                            <div style={{
                                padding: '24px',
                                borderBottom: '1px solid #E8DCC8',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2C1810' }}>
                                    {editingHabit ? 'Edit Habit' : 'Add New Habit'}
                                </h2>
                                <button
                                    onClick={cancelForm}
                                    style={{
                                        padding: '8px',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#F5EFE6'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <X style={{ width: '24px', height: '24px', color: '#6B5B4F' }} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div style={{ padding: '24px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#2C1810',
                                        marginBottom: '8px'
                                    }}>
                                        Habit Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Morning Exercise"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #E8DCC8',
                                            borderRadius: '8px',
                                            fontSize: '15px',
                                            transition: 'all 0.2s',
                                            boxSizing: 'border-box',
                                            color: '#2C1810'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#2C1810',
                                        marginBottom: '8px'
                                    }}>
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Add more details about your habit..."
                                        rows="3"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #E8DCC8',
                                            borderRadius: '8px',
                                            fontSize: '15px',
                                            transition: 'all 0.2s',
                                            boxSizing: 'border-box',
                                            resize: 'vertical',
                                            color: '#2C1810',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#2C1810',
                                        marginBottom: '8px'
                                    }}>
                                        Frequency
                                    </label>
                                    <select
                                        name="frequency"
                                        value={formData.frequency}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #E8DCC8',
                                            borderRadius: '8px',
                                            fontSize: '15px',
                                            transition: 'all 0.2s',
                                            boxSizing: 'border-box',
                                            cursor: 'pointer',
                                            color: '#2C1810',
                                            backgroundColor: '#FFFEF9'
                                        }}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#2C1810',
                                        marginBottom: '8px'
                                    }}>
                                        Goal Duration (days)
                                    </label>
                                    <input
                                        type="number"
                                        name="goal_duration"
                                        value={formData.goal_duration}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 30"
                                        min="1"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #E8DCC8',
                                            borderRadius: '8px',
                                            fontSize: '15px',
                                            transition: 'all 0.2s',
                                            boxSizing: 'border-box',
                                            color: '#2C1810'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#2C1810',
                                        marginBottom: '8px'
                                    }}>
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '2px solid #E8DCC8',
                                            borderRadius: '8px',
                                            fontSize: '15px',
                                            transition: 'all 0.2s',
                                            boxSizing: 'border-box',
                                            cursor: 'pointer',
                                            color: '#2C1810'
                                        }}
                                    />
                                </div>

                                {/* Modal Footer */}
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={cancelForm}
                                        style={{
                                            padding: '12px 24px',
                                            backgroundColor: '#F5EFE6',
                                            color: '#6B4423',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#E8DCC8'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#F5EFE6'}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        style={{
                                            padding: '12px 24px',
                                            backgroundColor: loading ? '#9ca3af' : '#8B6F47',
                                            color: '#FFFEF9',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#6B4423')}
                                        onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#8B6F47')}
                                    >
                                        {loading ? 'Saving...' : editingHabit ? 'Update Habit' : 'Add Habit'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Habit List */}
                {loading && habits.length === 0 ? (
                    <div style={{ backgroundColor: '#FFFEF9', border: '1px solid #E8DCC8', borderRadius: '12px', boxShadow: '0 4px 12px rgba(139, 111, 71, 0.1)', padding: '48px 12px', textAlign: 'center' }}>
                        <div style={{ animation: 'spin 1s linear infinite', height: '48px', width: '48px', borderRadius: '50%', border: '3px solid #E8DCC8', borderTopColor: '#8B6F47', margin: '0 auto' }}></div>
                        <p style={{ color: '#6B5B4F', marginTop: '16px', fontWeight: '500' }}>Loading your habits...</p>
                    </div>
                ) : habits.length === 0 ? (
                    <div style={{ backgroundColor: '#FFFEF9', border: '1px solid #E8DCC8', borderRadius: '12px', boxShadow: '0 4px 12px rgba(139, 111, 71, 0.1)', padding: '48px 12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                        <p style={{ fontSize: '20px', color: '#6B4423', marginBottom: '8px', fontWeight: '600' }}>No habits yet</p>
                        <p style={{ color: '#6B5B4F' }}>Start building better habits today!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                        {habits.map(habit => {
                            const completionColor = getCompletionColor(habit.completion_pct);
                            const streakEmoji = getStreakEmoji(habit.streak, habit.frequency || 'daily');

                            return (
                                <div key={habit.id}
                                    style={{
                                        backgroundColor: '#FFFEF9',
                                        border: '1px solid #E8DCC8',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(139, 111, 71, 0.1)',
                                        padding: '24px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 111, 71, 0.15)'}
                                    onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 111, 71, 0.1)'}
                                >
                                    {/* Habit Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2C1810', marginBottom: '4px' }}>
                                                {habit.title}
                                            </h3>
                                            {habit.description && (
                                                <p style={{ color: '#6B5B4F', fontSize: '14px', marginBottom: '8px' }}>{habit.description}</p>
                                            )}
                                            <span style={{
                                                display: 'inline-block',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                color: '#8B6F47',
                                                backgroundColor: '#F5EFE6',
                                                padding: '4px 12px',
                                                borderRadius: '9999px'
                                            }}>
                                                {(habit.frequency || 'daily').toUpperCase()}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleEdit(habit)}
                                                style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#F5EFE6'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                                title="Edit"
                                            >
                                                <Edit2 style={{ width: '20px', height: '20px', color: '#8B6F47' }} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(habit.id)}
                                                style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#FEF2F2'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                                title="Delete"
                                            >
                                                <Trash2 style={{ width: '20px', height: '20px', color: '#D85D5D' }} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Metrics */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                        gap: '16px',
                                        marginBottom: '16px'
                                    }}>
                                        {/* Completion */}
                                        <div style={{
                                            borderRadius: '8px',
                                            padding: '16px',
                                            backgroundColor: completionColor.bg,
                                            border: '1px solid #E8DCC8'
                                        }}>
                                            <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: completionColor.text, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                <TrendingUp style={{ width: '16px', height: '16px' }} />
                                                Completion
                                            </div>
                                            <div style={{ fontSize: '28px', fontWeight: '800', color: completionColor.text }}>
                                                {habit.completion_pct}%
                                            </div>
                                        </div>

                                        {/* Streak */}
                                        <div style={{ borderRadius: '8px', padding: '16px', backgroundColor: '#FFF7ED', border: '1px solid #E8DCC8' }}>
                                            <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: '#8B6F47', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                <Flame style={{ width: '16px', height: '16px' }} />
                                                Streak {streakEmoji}
                                            </div>
                                            <div style={{ fontSize: '28px', fontWeight: '800', color: '#8B6F47' }}>
                                                {habit.streak}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#8B6F47', marginTop: '4px', fontWeight: '500' }}>
                                                {(habit.frequency || 'daily') === 'daily' ? 'days' : habit.frequency === 'weekly' ? 'weeks' : 'months'}
                                            </div>
                                        </div>

                                        {/* Goal Progress */}
                                        <div style={{ borderRadius: '8px', padding: '16px', backgroundColor: '#F5EFE6', border: '1px solid #E8DCC8' }}>
                                            <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: '#6B4423', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                <CheckCircle style={{ width: '16px', height: '16px' }} />
                                                Goal Progress
                                            </div>
                                            <div style={{ fontSize: '28px', fontWeight: '800', color: '#6B4423' }}>
                                                {habit.goalProgress ?? 0}%
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#6B4423', marginTop: '4px', fontWeight: '500' }}>
                                                {habit.start_date && habit.end_date ? (
                                                    `${new Date(habit.start_date).toLocaleDateString()} → ${new Date(habit.end_date).toLocaleDateString()}`
                                                ) : (
                                                    'No dates set'
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mark Complete */}
                                    <button
                                        onClick={() => handleMarkCompletion(habit.id)}
                                        disabled={habit.completedToday}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            border: 'none',
                                            cursor: habit.completedToday ? 'default' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            backgroundColor: habit.completedToday ? '#F5EFE6' : '#8B6F47',
                                            color: habit.completedToday ? '#6B4423' : '#FFFEF9',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => !habit.completedToday && (e.target.style.backgroundColor = '#6B4423')}
                                        onMouseOut={(e) => !habit.completedToday && (e.target.style.backgroundColor = '#8B6F47')}
                                    >
                                        <CheckCircle style={{ width: '20px', height: '20px' }} />
                                        {habit.completedToday ? 'Completed Today ✓' : 'Mark as Complete Today'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HabitTrackerDashboard;