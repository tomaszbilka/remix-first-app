import { getStoredNotes } from "~/data/notes";
import { Link, useLoaderData } from "@remix-run/react";

import styles from "~/styles/note-details.css";
import { json } from "@remix-run/node";

const NoteDetails = () => {
  const note = useLoaderData();

  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all Notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">{note.content}</p>
    </main>
  );
};

export default NoteDetails;

export const links = () => [{ rel: "stylesheet", href: styles }];

export const loader = async ({ params }) => {
  const notes = await getStoredNotes();
  const selectedNote = notes.find((note) => note.id === params.noteId);
  if (!selectedNote) {
    throw json(
      { message: `There is no note with ID: ${params.noteId}` },
      {
        status: 404,
        statusText: "Not found",
      }
    );
  }
  return selectedNote;
};

export const meta = ({ data }) => [
  { title: data.title },
  { name: "description", content: data.content },
];
