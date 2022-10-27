import { GraphQLResult } from '@aws-amplify/api';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { API, graphqlOperation } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Observable from 'zen-observable-ts';
import { CreateNoteInput, ListNotesQuery, Note } from './API';
import './App.css';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';
import { listNotes } from './graphql/queries';
import { onCreateNote } from './graphql/subscriptions';

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
      const notes = apiData.data.listNotes.items as CreateNoteInput[];
      setNotes(notes);
    }
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;

    const newNote = { ...formData, id: uuidv4() };
    await API.graphql({ query: createNoteMutation, variables: { input: newNote } });
    setFormData(newNote);
  }

  async function deleteNote({ id }: CreateNoteInput) {
    const newNotesArray = notes.filter((note) => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } } });
  }

  return (
    <div className="App">
      <h1>My Notes App</h1>
      <input
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Note description"
        value={formData.description!}
      />
      <button onClick={createNote}>Create Note</button>
      <div style={{ marginBottom: 30 }}>
        {notes.map((note) => (
          <div key={note.id || note.name}>
            <h2>{note.name}</h2>
            <p>{note.description}</p>
            <button onClick={() => deleteNote(note)}>Delete note</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App);
