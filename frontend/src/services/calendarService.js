const BACKEND_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export const calendarService = {
    async getCalendarStatus() {
        try {
            const response = await fetch(`${BACKEND_BASE}/api/calendar/status`, {
                credentials: 'include',
            });
            
            if (response.ok) {
                return await response.json();
            }
            return { connected: false };
        } catch (error) {
            console.error('Error fetching calendar status:', error);
            return { connected: false };
        }
    },

    async connectCalendar() {
        try {
            // This will redirect to Google OAuth
            window.location.href = `${BACKEND_BASE}/api/calendar/connect`;
        } catch (error) {
            console.error('Error connecting calendar:', error);
            throw error;
        }
    },

    async disconnectCalendar() {
        try {
            const response = await fetch(`${BACKEND_BASE}/api/calendar/disconnect`, {
                method: 'DELETE',
                credentials: 'include',
            });
            
            if (response.ok) {
                return await response.json();
            }
            
            throw new Error('Failed to disconnect calendar');
        } catch (error) {
            console.error('Error disconnecting calendar:', error);
            throw error;
        }
    },

    async syncJobToCalendar(jobId) {
        try {
            const response = await fetch(`${BACKEND_BASE}/api/calendar/sync/job/${jobId}`, {
                method: 'POST',
                credentials: 'include',
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                const error = new Error(result.detail || 'Failed to sync job to calendar');
                error.status = response.status;
                throw error;
            }
            
            return result;
        } catch (error) {
            console.error('Error syncing job to calendar:', error);
            throw error;
        }
    },

    async syncAllJobsToCalendar() {
        try {
            const response = await fetch(`${BACKEND_BASE}/api/calendar/sync/all`, {
                method: 'POST',
                credentials: 'include',
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                const error = new Error(result.detail || 'Failed to sync jobs to calendar');
                error.status = response.status;
                throw error;
            }
            
            return result;
        } catch (error) {
            console.error('Error syncing all jobs to calendar:', error);
            throw error;
        }
    }
};
