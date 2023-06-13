import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import NewNote, { links as newNotesLinks } from '~/components/NewNote';
import NoteList, { links as noteListLinks } from '~/components/NoteList';
import { getStoredNotes, storeNotes } from '~/data/notes';

const NotesPage = () => {
  const notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
};

export default NotesPage;

export const links = () => [...newNotesLinks(), ...noteListLinks()];

export const action = async ({ request }) => {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  //Add validation...
  if (noteData.title.trim().length < 3) {
    return { message: 'Invalid title - must be at least 3 characters long!' };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  return redirect('/notes');
};

export const loader = async () => {
  const notes = await getStoredNotes();
  return notes;
};
