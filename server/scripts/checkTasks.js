const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const TaskSchema = new mongoose.Schema({
  title: String,
  status: String,
  priority: String,
  category: String,
  dueDate: Date,
  user: mongoose.Schema.Types.ObjectId
});

const Task = mongoose.model('Task', TaskSchema);

async function checkTasks() {
  const uri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(uri);
    const tasks = await Task.find();
    console.log(`FOUND ${tasks.length} TASKS IN DB:\n`);
    tasks.forEach(t => {
      console.log(`- Title: "${t.title}" | Status: "${t.status}" | Priority: "${t.priority}" | Category: "${t.category}"`);
    });
  } catch (err) {
    console.error(err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkTasks();
