const API_BASE_URL = 'http://localhost:8000/api';

export const jobService = {
  async getJobs() {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/`);
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
      const response = await fetch(`${API_BASE_URL}/jobs/`, {
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
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
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
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
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
  }
};
