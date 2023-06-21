export const misskeyNoteConverter = (note, noteMediaIds) => {
  if (noteMediaIds.length > 0) {
    return {
      media: {
        media_ids: noteMediaIds,
      },
    };
  }
};
