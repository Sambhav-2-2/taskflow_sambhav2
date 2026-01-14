const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

/**
 * Get all tasks for authenticated user
 * GET /api/tasks
 */
const getTasks = (req, res) => {
    try {
        const userId = req.user.id;
        const { status, priority, category, search, sortBy, sortOrder } = req.query;

        let query = 'SELECT * FROM tasks WHERE userId = ?';
        const params = [userId];

        // Apply filters
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (priority) {
            query += ' AND priority = ?';
            params.push(priority);
        }

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        if (search) {
            query += ' AND (title LIKE ? OR description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        // Apply sorting
        const validSortFields = ['title', 'priority', 'status', 'dueDate', 'createdAt', 'updatedAt'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const order = sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        query += ` ORDER BY ${sortField} ${order}`;

        const tasks = db.prepare(query).all(...params);

        res.json({
            success: true,
            count: tasks.length,
            tasks
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tasks'
        });
    }
};

/**
 * Get single task by ID
 * GET /api/tasks/:id
 */
const getTask = (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND userId = ?').get(id, userId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({
            success: true,
            task
        });
    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching task'
        });
    }
};

/**
 * Create new task
 * POST /api/tasks
 */
const createTask = (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, category, priority, status, dueDate } = req.body;

        const taskId = uuidv4();
        const now = new Date().toISOString();

        const insertTask = db.prepare(`
      INSERT INTO tasks (id, title, description, category, priority, status, dueDate, createdAt, updatedAt, userId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        insertTask.run(
            taskId,
            title,
            description || null,
            category || null,
            priority || 'Medium',
            status || 'Pending',
            dueDate || null,
            now,
            now,
            userId
        );

        const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            task
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating task'
        });
    }
};

/**
 * Update task
 * PUT /api/tasks/:id
 */
const updateTask = (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { title, description, category, priority, status, dueDate } = req.body;

        // Check if task exists and belongs to user
        const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ? AND userId = ?').get(id, userId);

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const now = new Date().toISOString();

        const updateTaskQuery = db.prepare(`
      UPDATE tasks 
      SET title = ?, description = ?, category = ?, priority = ?, status = ?, dueDate = ?, updatedAt = ?
      WHERE id = ? AND userId = ?
    `);

        updateTaskQuery.run(
            title ?? existingTask.title,
            description ?? existingTask.description,
            category ?? existingTask.category,
            priority ?? existingTask.priority,
            status ?? existingTask.status,
            dueDate ?? existingTask.dueDate,
            now,
            id,
            userId
        );

        const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

        res.json({
            success: true,
            message: 'Task updated successfully',
            task
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating task'
        });
    }
};

/**
 * Delete task
 * DELETE /api/tasks/:id
 */
const deleteTask = (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if task exists and belongs to user
        const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ? AND userId = ?').get(id, userId);

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        db.prepare('DELETE FROM tasks WHERE id = ? AND userId = ?').run(id, userId);

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting task'
        });
    }
};

/**
 * Get task statistics
 * GET /api/tasks/stats
 */
const getTaskStats = (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

        // Total tasks
        const total = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE userId = ?').get(userId).count;

        // Tasks by status
        const pending = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE userId = ? AND status = 'Pending'")
            .get(userId).count;
        const inProgress = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE userId = ? AND status = 'In Progress'")
            .get(userId).count;
        const completed = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE userId = ? AND status = 'Completed'")
            .get(userId).count;

        // Tasks by priority
        const highPriority = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE userId = ? AND priority = 'High'")
            .get(userId).count;
        const mediumPriority = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE userId = ? AND priority = 'Medium'")
            .get(userId).count;
        const lowPriority = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE userId = ? AND priority = 'Low'")
            .get(userId).count;

        // Overdue tasks
        const overdue = db.prepare(`
      SELECT COUNT(*) as count FROM tasks 
      WHERE userId = ? AND dueDate < ? AND status != 'Completed'
    `).get(userId, now.toISOString()).count;

        // Due soon (within 3 days)
        const dueSoon = db.prepare(`
      SELECT COUNT(*) as count FROM tasks 
      WHERE userId = ? AND dueDate >= ? AND dueDate <= ? AND status != 'Completed'
    `).get(userId, now.toISOString(), threeDaysFromNow).count;

        // Tasks by category
        const categories = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM tasks 
      WHERE userId = ? AND category IS NOT NULL AND category != ''
      GROUP BY category
    `).all(userId);

        const byCategory = {};
        categories.forEach(cat => {
            byCategory[cat.category] = cat.count;
        });

        // Recent tasks (last 7 days)
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const recentlyCompleted = db.prepare(`
      SELECT COUNT(*) as count FROM tasks 
      WHERE userId = ? AND status = 'Completed' AND updatedAt >= ?
    `).get(userId, sevenDaysAgo).count;

        res.json({
            success: true,
            stats: {
                total,
                pending,
                inProgress,
                completed,
                highPriority,
                mediumPriority,
                lowPriority,
                overdue,
                dueSoon,
                byCategory,
                recentlyCompleted,
                completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
            }
        });
    } catch (error) {
        console.error('Get task stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching task statistics'
        });
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats
};
