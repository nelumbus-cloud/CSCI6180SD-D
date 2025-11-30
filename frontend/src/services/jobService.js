const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const JOBS_BASE_URL = `${API_BASE_URL}/api/jobs`;

export const jobService = {
  async getJobs() {
    try {
      const response = await fetch(`${JOBS_BASE_URL}/`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch jobs: ${response.status} ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  async createJob(jobData) {
    try {
      const response = await fetch(`${JOBS_BASE_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create job: ${response.status} ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  async updateJob(jobId, jobData) {
    try {
      const response = await fetch(`${JOBS_BASE_URL}/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      if (!response.ok) {
        throw new Error('Failed to update job');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  async deleteJob(jobId) {
    try {
      const response = await fetch(`${JOBS_BASE_URL}/${jobId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete job');
      }
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  async parseJobDescription(text) {
    try {
      const response = await fetch(`${JOBS_BASE_URL}/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to parse job description: ${response.status} ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error parsing job description:', error);
      throw error;
    }
  }
};
