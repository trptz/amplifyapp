import { GraphQLResult } from '@aws-amplify/api';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { ChatContainer, MainContainer, Message, MessageInput, MessageList } from '@chatscope/chat-ui-kit-react';
import { API, graphqlOperation } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Observable from 'zen-observable-ts';
import { CreateNoteInput, ListNotesQuery, Note } from './API';
import './App.css';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';
import { listNotes } from './graphql/queries';
import { onCreateNote } from './graphql/subscriptions';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

type OnCreateNoteSubscriptionData = {
  onCreateNote?: Note | null;
};

type OnCreateNoteSubscriptionEvent = {
  value: { data: OnCreateNoteSubscriptionData };
};

const initialFormState: CreateNoteInput = { id: '', name: '', description: '' };

function App() {
  const [notes, setNotes] = useState<CreateNoteInput[]>([]);
  const [formData, setFormData] = useState<CreateNoteInput>(initialFormState);

  const onCreateSubscribe = () => {
    const subscription = (
      API.graphql(graphqlOperation(onCreateNote)) as Observable<OnCreateNoteSubscriptionEvent>
    ).subscribe({
      next: ({ value }) => {
        const { onCreateNote } = value.data;
        if (onCreateNote) {
          const note = { id: onCreateNote.id, name: onCreateNote.name, description: onCreateNote.description };
          setNotes((prev) => [...prev, note]);
          setFormData(initialFormState);
        }
      },
    });
    return subscription;
  };

  useEffect(() => {
    fetchNotes();

    const onCreateSubscription = onCreateSubscribe();
    return () => onCreateSubscription.unsubscribe();
  }, []);

  async function fetchNotes() {
    const apiData = (await API.graphql(graphqlOperation(listNotes))) as GraphQLResult<ListNotesQuery>;
    if (apiData.data?.listNotes?.items) {
      console.log(apiData.data.listNotes);
      const notes = apiData.data.listNotes.items as Note[];
      const sortedNotes = notes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setNotes(sortedNotes);
    }
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;

    const newNote = { ...formData, id: uuidv4() };
    await API.graphql({ query: createNoteMutation, variables: { input: newNote } });
  }

  const { pathname } = window.location;
  const myName = pathname.split('/')[1];

  return (
    <>
      <h1>Chat App</h1>
      <div style={{ position: 'relative', height: '500px' }}>
        <MainContainer>
          <ChatContainer>
            <MessageList>
              {notes.map((note) => {
                const { id, name, description } = note;
                const isMyMsg = myName === name;
                const direction = isMyMsg ? 'incoming' : 'outgoing';
                return (
                  <Message
                    key={id}
                    model={{
                      message: description || '',
                      sentTime: 'just now',
                      sender: name,
                      direction,
                      position: 'normal',
                    }}
                  />
                );
              })}
            </MessageList>
            <MessageInput
              placeholder="こんにちは"
              onChange={(description) => setFormData({ ...formData, name: myName, description })}
              value={formData.description!}
              attachButton={false}
              onSend={createNote}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  );
}

export default withAuthenticator(App);
