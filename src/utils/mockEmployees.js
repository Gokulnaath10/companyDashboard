const employees = [
  { id: 1, name: "Michael Chen", role: "CEO", department: "Executive", parentId: null, color: "#E85D04", email: "michael@nexus.com", joined: "2019-01-15" },
  { id: 2, name: "Alice Johnson", role: "CTO", department: "Technology", parentId: 1, color: "#0077B6", email: "alice@nexus.com", joined: "2019-03-20" },
  { id: 3, name: "Sara Williams", role: "HR Director", department: "HR", parentId: 1, color: "#2D6A4F", email: "sara@nexus.com", joined: "2019-06-01" },
  { id: 4, name: "David Lee", role: "CFO", department: "Finance", parentId: 1, color: "#7B2CBF", email: "david@nexus.com", joined: "2020-01-10" },
  { id: 5, name: "Bob Smith", role: "Backend Lead", department: "Technology", parentId: 2, color: "#0096C7", email: "bob@nexus.com", joined: "2020-04-15" },
  { id: 6, name: "Emily Davis", role: "Frontend Lead", department: "Technology", parentId: 2, color: "#0096C7", email: "emily@nexus.com", joined: "2020-07-22" },
  { id: 7, name: "James Wilson", role: "HR Manager", department: "HR", parentId: 3, color: "#40916C", email: "james@nexus.com", joined: "2021-02-14" },
  { id: 8, name: "Lisa Brown", role: "Finance Analyst", department: "Finance", parentId: 4, color: "#9D4EDD", email: "lisa@nexus.com", joined: "2021-05-30" },
  { id: 9, name: "Tom Harris", role: "DevOps Engineer", department: "Technology", parentId: 5, color: "#48CAE4", email: "tom@nexus.com", joined: "2022-01-10" },
  { id: 10, name: "Nina Patel", role: "UI Developer", department: "Technology", parentId: 6, color: "#48CAE4", email: "nina@nexus.com", joined: "2022-03-18" },
];

export default employees;
