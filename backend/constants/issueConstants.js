exports.SEVERITIES = ["Low", "Medium", "High", "Critical"];
exports.PRIOROTIES = ["Low", "Medium", "High", "Urgent"];
exports.STATUSES = ["Open", "In Progress", "Testing", "Resolved", "Closed"];

exports.STATUS_TRANSITIONS = {
  'Open': ['In Progress'],
  'In Progress': ['Testing'],
  'Testing': ['Resolved', 'In Progress'],
  'Resolved': ['Closed', 'Open'],
  'Closed': [],
};

