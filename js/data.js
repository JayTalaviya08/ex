export function generateData(rowCount = 10) {
  const firstNames = ["Raj", "Ameet", "Harsh", "Jay", "Anil", "Neha", "Ravi", "Kiran", "Vijay", "Deepak"];
  const lastNames = ["Solanki", "Mishra", "Patel", "Talaviya", "Mehta", "Verma", "Desai", "Iyer", "Reddy", "Kapoor", "Bose"];

  const dataMap = new Map();

  // Header
  const headerLabels = ["ID", "First Name", "Last Name", "Age", "Salary"];
  const headerRowMap = new Map();
  headerLabels.forEach((label, colIndex) => {
    headerRowMap.set(colIndex, label);
  });
  dataMap.set(0, headerRowMap);

  // Data rows
  for (let i = 1; i <= rowCount; i++) {
    const rowMap = new Map();
    const id = i;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = Math.floor(Math.random() * 42) + 18;
    const salary = Math.floor(Math.random() * 9000000) + 100000;
    const values = [id, firstName, lastName, age, salary];

    values.forEach((value, colIndex) => {
      rowMap.set(colIndex, value);
    });

    dataMap.set(i, rowMap);
  }

  // console.log("Data Map:", dataMap);
  return dataMap;
}
