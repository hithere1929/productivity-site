document.addEventListener("DOMContentLoaded", () => {
  const noteTitle = document.getElementById("noteTitle");
  const noteContent = document.getElementById("noteContent");
  const addNoteBtn = document.getElementById("addNoteBtn");
  const notesList = document.getElementById("notesList");

  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function renderNotes() {
    notesList.innerHTML = "";
    notes.forEach((note, index) => {
      const li = document.createElement("li");
      li.className = "task-item";

      const textSpan = document.createElement("span");
      textSpan.innerHTML = `<strong>${note.title}</strong><br><small>${note.content}</small>`;

      const btnGroup = document.createElement("div");
      btnGroup.className = "task-buttons";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => {
        notes.splice(index, 1);
        saveNotes();
        renderNotes();
      });

      btnGroup.appendChild(deleteBtn);
      li.appendChild(textSpan);
      li.appendChild(btnGroup);
      notesList.appendChild(li);
    });
  }

  function addNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    if (!title && !content) return;

    notes.push({ title, content });
    noteTitle.value = "";
    noteContent.value = "";
    saveNotes();
    renderNotes();
  }

  addNoteBtn.addEventListener("click", addNote);

  renderNotes();
});