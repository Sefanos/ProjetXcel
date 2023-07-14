import pb from "./PocketBase";

export const fetchTasks = async (projectId, userRole, userCurrent) => {
  const tasksCollection = pb.collection("Tasks");

  try {
    let records = [];

    if (userRole === "Directeur") {
      // Fetch all tasks for "Directeur" user
      records = await tasksCollection.getFullList();
    } else if (userRole === "Collaborateur") {
      // Fetch tasks related to the specific collaborateur
      records = await tasksCollection.getFullList({
        filter: `ProjectId ?= "${projectId}" && collaborateurId ?= "${userCurrent}"`,
      });
    }

    const data = records.map((record) => ({
      id: record.id,
      Task: record.title,
      Description: record.description,
      Priority : record.priorite,
      Due_Date: record.dateDecheance,
      columnId: record.columnId,
      collaborateur: record.collaborateurId,
    }));

    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const fetchColumns = async (projectId) => {
  const columnsCollection = pb.collection("Columns");

  try {
    const records = await columnsCollection.getFullList({
      filter: `ProjectId ?= "${projectId}"`,
    });
    const data = records.map((record) => ({
      id: record.id,
      title: record.title,
    }));

    return data;
  } catch (error) {
    console.error("Error fetching columns:", error);
    return [];
  }
};

export const columnsFromBackend = async (projectId, userRole, userCurrent) => {
  const tasks = await fetchTasks(projectId, userRole, userCurrent);
  const columns = await fetchColumns(projectId);

  const columnsData = columns.reduce((acc, column) => {
    acc[column.id] = {
      title: column.title,
      items: [],
    };
    return acc;
  }, {});

  tasks.forEach((task) => {
    if (task.columnId && columnsData[task.columnId]) {
      columnsData[task.columnId].items.push(task);
    }
  });

  return columnsData;
};
