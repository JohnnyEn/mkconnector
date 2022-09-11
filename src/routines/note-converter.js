export const misskeyNoteConverter = (note, noteMediaIds) => {
  return {
    media_ids: noteMediaIds.join(),
  };
};
