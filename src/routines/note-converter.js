export const misskeyNoteConverter = (note, noteMediaIds) => {
  return {
    media: {
      media_ids: noteMediaIds.join(),
    }
  };
};
