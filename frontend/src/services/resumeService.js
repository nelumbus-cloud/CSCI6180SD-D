const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

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
      const response = await fetch(`${API_BASE_URL}/resume/`, {
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
      const response = await fetch(`${API_BASE_URL}/resume/`, {
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
      const response = await fetch(`${API_BASE_URL}/resume/personal`, {
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
      const response = await fetch(`${API_BASE_URL}/resume/experience`, {
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
      const response = await fetch(`${API_BASE_URL}/resume/education`, {
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
      const response = await fetch(`${API_BASE_URL}/resume/skills`, {
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
      const response = await fetch(`${API_BASE_URL}/resume/projects`, {
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
      const response = await fetch(`${API_BASE_URL}/resume/`, {
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
};

