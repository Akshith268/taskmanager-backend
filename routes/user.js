// Import the necessary modules
const express = require('express');
const router = express.Router();
const verify = require('../verifyToken'); // Import your authentication middleware
const User = require('../models/User');

// Define a route to fetch user tasks (protected route)
router.get('/usertasks', verify, async (req, res) => {
    const userId = req.user.id; // Extract user ID from authenticated token
    console.log("User ID:", userId);
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json(user.tasks);
    } catch (err) {
        console.error("Error fetching user tasks:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Example endpoint for editing a task
router.put('/tasksupdate', verify, async (req, res) => {
    const userId = req.user.id;
    const { taskId, name, description, date, time } = req.body;

    try {
        // Find the user by ID and update the task
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Find the task by ID and update its fields
        const taskToUpdate = user.tasks.id(taskId);
        if (!taskToUpdate) {
            return res.status(404).json({ message: "Task not found." });
        }
        taskToUpdate.name = name;
        taskToUpdate.description = description;
        taskToUpdate.date = date;
        taskToUpdate.time = time;

        // Save the updated user document
        await user.save();

        return res.status(200).json({ message: "Task updated successfully." });
    } catch (err) {
        console.error("Error updating task:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Route to delete a task
router.delete('/tasksdelete', verify, async (req, res) => {
    const userId = req.user.id;
    const taskId = req.body.taskId;

    try {
        // Find the user by ID and delete the task
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.tasks.pull({ _id: taskId });
        await user.save();

        return res.status(200).json({ message: "Task deleted successfully." });
    } catch (err) {
        console.error("Error deleting task:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Route to mark a task as completed or not
router.put('/taskscomplete', verify, async (req, res) => {
    const userId = req.user.id;
    const { taskId, completed } = req.body;

    try {
        // Find the user by ID and update the task's completion status
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const taskToUpdate = user.tasks.id(taskId);
        if (!taskToUpdate) {
            return res.status(404).json({ message: "Task not found." });
        }
        taskToUpdate.completed = completed;

        // Save the updated user document
        await user.save();

        return res.status(200).json({ message: "Task completion status updated successfully." });
    } catch (err) {
        console.error("Error updating task completion status:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.get('/completedtasks', verify, async (req, res) => {
    const userId = req.user.id; // Extract user ID from authenticated token
    console.log("User ID:", userId);
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      // Filter completed tasks
      const completedTasks = user.tasks.filter(task => task.completed === true);
      return res.status(200).json(completedTasks);
    } catch (err) {
      console.error("Error fetching completed tasks:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  });

module.exports = router;
