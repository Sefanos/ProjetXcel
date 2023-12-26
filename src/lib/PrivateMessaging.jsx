// import { useEffect, useState } from 'react';
// import pb from './PocketBase';

// const PrivateMessaging = () => {
//   const [messages, setMessages] = useState([]);
//   const userId = pb.authStore.model.id;
//   const recipientId = "xutws7us3s3036q";

//   // Function to fetch messages between the current user and recipient
//   const fetchMessages = async () => {
//     try {
//       // Fetch messages sent by the current user to the recipient
//       const sentMessages = await pb.collection('Messages')
//         .getFullList({
//           sort: 'created',
//           filter: `userId = "${userId}" && recipientId = "${recipientId}"`,
//         });

//       // Fetch messages sent by the recipient to the current user
//       const receivedMessages = await pb.collection('Messages')
//         .getFullList({
//           sort: 'created',
//           filter: `userId = "${recipientId}" && recipientId = "${userId}"`,
//         });

//       // Combine sent and received messages
//       const allMessages = [...sentMessages, ...receivedMessages];

//       // Sort combined messages by timestamp
//       const sortedMessages = allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

//       // Update state with fetched messages
//       setMessages(sortedMessages);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   useEffect(() => {
//     fetchMessages(); // Fetch messages on initial load or when userId or recipientId changes
//   }, [userId, recipientId]);

//   // Function to send a message
//   const sendMessage = async (content) => {
//     try {
//       // Create a new message with sender and recipient IDs
//       await pb.collection('Messages').create({
//         userId: userId,
//         recipientId: recipientId,
//         content: content,
//         timestamp: new Date().toISOString(),
//       });

//       // Fetch updated messages after sending
//       fetchMessages();
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   console.log(messages)

//   return (
//     <div>
//       {/* Render chat messages */}
//       {messages.map((message) => (
//         <div key={message.id}>
//           {/* Differentiate sent and received messages */}
//           {message.userId === userId ? (
//             <p><strong>You:</strong> {message.content}</p>
//           ) : (
//             <p><strong>Recipient:</strong> {message.content}</p>
//           )}
//         </div>
//       ))}

//       {/* Input field to send a message */}
//       <input
//         type="text"
//         placeholder="Type a message..."
//         onKeyDown={(e) => {
//           if (e.key === 'Enter') {
//             sendMessage(e.target.value);
//             e.target.value = '';
//           }
//         }}
//       />
//     </div>
//   );
// };

// export default PrivateMessaging;
