const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const NOTES_BASE_URL = `${API_BASE_URL}/api/notes`;

/**
 * Notes Service - Handles all notes-related API calls
 */
export const notesService = {
  /**
   * Get all notes for the current user
   * @returns {Promise<Array>} Array of notes
   */
  async getNotes() {
    try {
      const response = await fetch(`${NOTES_BASE_URL}/`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        }
        const errorText = await response.text();
        throw new Error(`Failed to fetch notes: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  /**
   * Create a new note
   * @param {Object} noteData - Note data with title and content
   * @returns {Promise<Object>} Created note
   */
  async createNote(noteData) {
    try {
      const response = await fetch(`${NOTES_BASE_URL}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        }
        const errorText = await response.text();
        throw new Error(`Failed to create note: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  /**
   * Update an existing note
   * @param {string} noteId - ID of the note to update
   * @param {Object} noteData - Updated note data
   * @returns {Promise<Object>} Updated note
   */
  async updateNote(noteId, noteData) {
    try {
      const response = await fetch(`${NOTES_BASE_URL}/${noteId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        }
        if (response.status === 404) {
          throw new Error('Note not found');
        }
        const errorText = await response.text();
        throw new Error(`Failed to update note: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  /**
   * Delete a note
   * @param {string} noteId - ID of the note to delete
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async deleteNote(noteId) {
    try {
      const response = await fetch(`${NOTES_BASE_URL}/${noteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        }
        if (response.status === 404) {
          throw new Error('Note not found');
        }
        const errorText = await response.text();
        throw new Error(`Failed to delete note: ${response.status} ${errorText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },
};
