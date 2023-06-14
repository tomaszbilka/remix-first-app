import { getStoredNotes, storeNotes } from "~/data/notes";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import NewNote, { links as newNotesLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";

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

export const meta = () => [
  { title: "All notes" },
  { name: "description", content: "My note page description" },
];

export const action = async ({ request }) => {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  //Add validation...
  if (noteData.title.trim().length < 3) {
    return { message: "Invalid title - must be at least 3 characters long!" };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  return redirect("/notes");
};

export const loader = async () => {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json(
      { message: "Could not find any notes" },
      {
        status: 404,
        statusText: "Not found",
      }
    );
  }
  return notes;
};

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main className="info-message">
        <NewNote />
        <p>
          {error?.status} {error?.statusText}
        </p>
        <p>{error?.data?.message}</p>
      </main>
    );
  }

  return (
    <main className="error">
      <h1>An error with your notes occured!</h1>
      <p>{error?.message}</p>
      <p>
        Back to <Link to="/">saftey</Link>
      </p>
    </main>
  );
};
