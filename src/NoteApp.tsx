import { FC } from 'react';

export const NoteApp: FC = () => {
  return <div>aaaa</div>;
};

// import { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
// import { withAuthenticator } from '@aws-amplify/ui-react';
// import { API } from 'aws-amplify';
// import { useEffect, useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import { CreateMessageInput, DeleteMessageInput, ListMessagesQuery, ListNotesQuery, Message } from './API';
// import './App.css';
// import { createMessage as createMessageMutation, deleteMessage as deleteMessageMutation } from './graphql/mutations';
// import { listMessages, listNotes } from './graphql/queries';
//
// const initialFormState: CreateMessageInput = { text: '' };
//
// function App() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [formData, setFormData] = useState<CreateMessageInput>(initialFormState);
//
//   useEffect(() => {
//     fetchMessages();
//   }, []);
//
//   const fetchMessages = async () => {
//     const aaaa = (await API.graphql(graphqlOperation(listNotes))) as GraphQLResult<ListNotesQuery>;
//     console.log({ aaaa });
//     const apiData = (await API.graphql(graphqlOperation(listMessages))) as GraphQLResult<ListMessagesQuery>;
//     if (apiData.data?.listMessages?.items) {
//       const messagesRes = apiData.data.listMessages.items as Message[];
//       setMessages(messagesRes);
//     }
//   };
//
//   const createMessage = async () => {
//     if (!formData.text) return;
//
//     const newMsg = { ...formData, id: uuidv4() };
//     console.log('newMsg', newMsg);
//     await API.graphql(graphqlOperation(createMessageMutation, { input: newMsg }));
//     console.log('res');
//     setMessages([...messages, newMsg]);
//     setFormData(newMsg);
//   };
//
//   async function deleteMessage({ id }: DeleteMessageInput) {
//     const newMessages = messages.filter((msg) => msg.id !== id);
//     setMessages(newMessages);
//     await API.graphql({ query: deleteMessageMutation, variables: { input: { id } } });
//   }
//
//   return (
//     <div className="App">
//       <h1>Chat App</h1>
//       <input
//         onChange={(e) => setFormData({ ...formData, text: e.target.value })}
//         placeholder="message"
//         value={formData.text}
//       />
//       <button onClick={createMessage}>Create Msg</button>
//       <div style={{ marginBottom: 30 }}>
//         {messages.map((msg) => (
//           <div key={msg.id}>
//             <h2>{msg.text}</h2>
//             <button onClick={() => deleteMessage(msg)}>Delete msg</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
//
// export default withAuthenticator(App);
