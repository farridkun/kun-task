// Text search index for full-text search on title and description
db.tasks.createIndex(
  { title: "text", description: "text" }, 
  { name: "text_title_description" }
);

// Compound index for common filtering and sorting operations
db.tasks.createIndex(
  { status: 1, priority: 1, dueDate: 1, createdAt: 1 }, 
  { name: "compound_query" }
);

// Index for due date range queries
db.tasks.createIndex(
  { dueDate: 1 }, 
  { name: "dueDate_range" }
);

// Index for sorting by creation date (most recent first)
db.tasks.createIndex(
  { createdAt: -1 }, 
  { name: "createdAt_desc" }
);
