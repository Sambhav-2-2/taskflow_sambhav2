import { format, formatDistanceToNow, isAfter, isBefore, addDays, parseISO } from 'date-fns';

// Format date for display
export const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        const date = parseISO(dateString);
        return format(date, 'MMM d, yyyy');
    } catch {
        return '';
    }
};

// Format date with time
export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    try {
        const date = parseISO(dateString);
        return format(date, 'MMM d, yyyy h:mm a');
    } catch {
        return '';
    }
};

// Format relative time
export const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    try {
        const date = parseISO(dateString);
        return formatDistanceToNow(date, { addSuffix: true });
    } catch {
        return '';
    }
};

// Check if date is overdue
export const isOverdue = (dateString) => {
    if (!dateString) return false;
    try {
        const date = parseISO(dateString);
        return isBefore(date, new Date());
    } catch {
        return false;
    }
};

// Check if date is due soon (within 3 days)
export const isDueSoon = (dateString) => {
    if (!dateString) return false;
    try {
        const date = parseISO(dateString);
        const now = new Date();
        const threeDaysFromNow = addDays(now, 3);
        return isAfter(date, now) && isBefore(date, threeDaysFromNow);
    } catch {
        return false;
    }
};

// Format date for input field
export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        const date = parseISO(dateString);
        return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch {
        return '';
    }
};

// Get priority color class
export const getPriorityClass = (priority) => {
    switch (priority) {
        case 'High':
            return 'priority-high';
        case 'Medium':
            return 'priority-medium';
        case 'Low':
            return 'priority-low';
        default:
            return 'badge-info';
    }
};

// Get status color class
export const getStatusClass = (status) => {
    switch (status) {
        case 'Pending':
            return 'status-pending';
        case 'In Progress':
            return 'status-in-progress';
        case 'Completed':
            return 'status-completed';
        default:
            return 'badge-info';
    }
};

// Truncate text
export const truncate = (text, length = 50) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

// Validate email
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Capitalize first letter
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Get initials from name
export const getInitials = (name) => {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Default categories
export const defaultCategories = [
    'Work',
    'Personal',
    'Shopping',
    'Health',
    'Finance',
    'Education',
    'Home',
    'Other'
];

// Priority options
export const priorityOptions = [
    { value: 'High', label: 'High', color: 'text-red-500' },
    { value: 'Medium', label: 'Medium', color: 'text-amber-500' },
    { value: 'Low', label: 'Low', color: 'text-green-500' }
];

// Status options
export const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' }
];
