export const exportTasksToCSV = (tasks) => {
  if (!tasks || tasks.length === 0) {
    alert('No tasks available to export.');
    return;
  }

  const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Category', 'DueDate', 'CreatedAt'];
  const rows = tasks.map(t => [
    `"${t.id || t._id || ''}"`,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    `"${t.status || 'todo'}"`,
    `"${t.priority || 'medium'}"`,
    `"${t.category || 'General'}"`,
    `"${t.dueDate || ''}"`,
    `"${t.createdAt || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `TaskFlow_Pro_Tasks_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
