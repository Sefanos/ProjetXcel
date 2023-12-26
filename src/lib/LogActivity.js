import pb from "./PocketBase";

export const logUserActivity = async (userId, action, objectId , tasksID) => {
  try {
    const data = {
      "UserID": userId,
      "Action": action,
      "Timestamp": new Date().toISOString(),
    };

    // Add 'ObjectID' field only if it's not null
    if (objectId !== null) {
      data["ObjectID"] = objectId;
    }

    if (objectId !== null) {
      data["TasksID"] = tasksID;
    }

    // Log the user activity into the 'UserActivityLog' collection
    await pb.collection('UserActivityLog').create(data);

  } catch (error) {
    console.error('Error logging user activity:', error);
  }
};