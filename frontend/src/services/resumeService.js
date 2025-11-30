const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const RESUME_BASE_URL = `${API_BASE_URL}/api/resume`;

/**
 * Resume Service - Handles all resume-related API calls
 */
export const resumeService = {
  /**
   * Get current user's resume
   * @returns {Promise<Object>} Resume data
   */
  async getResume() {
    try {
      const response = await fetch(`${RESUME_BASE_URL}/`, {
        method: 'GET',
        credentials: 'include', // Important: include cookies for authentication
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        }
        const errorText = await response.text();
        throw new Error(`Failed to fetch resume: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      // If no resume exists, return empty structure
      if (!data.id) {
        return {
          personal: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            portfolio: '',
            summary: ''
          },
          experience: [],
          education: [],
          skills: [],
          projects: []
        };
      }
      return data;
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw error;
    }
  },

  /**
   * Save entire resume
   * @param {Object} resumeData - Complete resume data
   * @returns {Promise<Object>} Saved resume data
   */
  async saveResume(resumeData) {
    try {
      const response = await fetch(`${RESUME_BASE_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        }
        const errorText = await response.text();
        throw new Error(`Failed to save resume: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving resume:', error);
      throw error;
    }
  },

  /**
   * Update personal information section
   * @param {Object} personalInfo - Personal information data
   * @returns {Promise<Object>} Updated resume data
   */
  async updatePersonalInfo(personalInfo) {
    try {
      const response = await fetch(`${RESUME_BASE_URL}/personal`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(personalInfo),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        }
        const errorText = await response.text();
        throw new Error(`Failed to update personal info: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating personal info:', error);
      throw error;
    }
  },

  /**
   * Update experience section
   * @param {Array} experience - Array of experience items
   * @returns {Promise<Object>} Updated resume data
   */
  async updateExperience(experience) {
    try {
      const response = await fetch(`${RESUME_BASE_URL}/experience`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(experience),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        }
        const errorText = await response.text();
        throw new Error(`Failed to update experience: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating experience:', error);
      throw error;
    }
  },

  /**
   * Update education section
   * @param {Array} education - Array of education items
   * @returns {Promise<Object>} Updated resume data
   */
  async updateEducation(education) {
    try {
      const response = await fetch(`${RESUME_BASE_URL}/education`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(education),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        }
        const errorText = await response.text();
        throw new Error(`Failed to update education: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating education:', error);
      throw error;
    }
  },

  /**
   * Update skills section
   * @param {Array} skills - Array of skill items
   * @returns {Promise<Object>} Updated resume data
   */
  async updateSkills(skills) {
    try {
      const response = await fetch(`${RESUME_BASE_URL}/skills`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(skills),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        }
        const errorText = await response.text();
        throw new Error(`Failed to update skills: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating skills:', error);
      throw error;
    }
  },

  /**
   * Update projects section
   * @param {Array} projects - Array of project items
   * @returns {Promise<Object>} Updated resume data
   */
  async updateProjects(projects) {
    try {
      const response = await fetch(`${RESUME_BASE_URL}/projects`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(projects),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        }
        const errorText = await response.text();
        throw new Error(`Failed to update projects: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating projects:', error);
      throw error;
    }
  },

  /**
   * Delete resume
   * @returns {Promise<Object>} Success message
   */
  async deleteResume() {
    try {
      const response = await fetch(`${RESUME_BASE_URL}/`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        }
        const errorText = await response.text();
        throw new Error(`Failed to delete resume: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  },

  /**
   * Download PDF generated from saved resume on server
   */
  async downloadSavedPdf() {
    try {
      const response = await fetch(`${RESUME_BASE_URL}/download`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to download PDF: ${response.status} ${errorText}`);
      }

      const blob = await response.blob();
      // Try to get filename from header
      const cd = response.headers.get('Content-Disposition') || '';
      let filename = 'resume.pdf';
      const match = /filename="?([^";]+)"?/.exec(cd);
      if (match && match[1]) filename = match[1];

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading saved PDF:', error);
      throw error;
    }
  },

  /**
   * Download PDF generated from provided resume data (no save)
   * @param {Object} resumeData
   */
  async downloadPdfFromData(resumeData) {
    try {
      const response = await fetch(`${RESUME_BASE_URL}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to download PDF: ${response.status} ${errorText}`);
      }

      const blob = await response.blob();
      const cd = response.headers.get('Content-Disposition') || '';
      let filename = 'resume.pdf';
      const match = /filename="?([^";]+)"?/.exec(cd);
      if (match && match[1]) filename = match[1];

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF from data:', error);
      throw error;
    }
  }
};

