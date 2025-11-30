import { useState, useEffect } from 'react';
import { Calendar, Check, X, Loader, LogOut, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { calendarService } from '@/services/calendarService';

export default function Settings() {
    const { user } = useAuth();
    const [calendarConnected, setCalendarConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Check calendar connection status on mount
    useEffect(() => {
        const checkCalendarStatus = async () => {
            try {
                setLoading(true);
                const data = await calendarService.getCalendarStatus();
                setCalendarConnected(data.connected);
            } catch (err) {
                console.error('Error checking calendar status:', err);
            } finally {
                setLoading(false);
            }
        };

        checkCalendarStatus();
    }, []);

    // Check for calendar_connected query param (after OAuth redirect)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('calendar_connected') === 'true') {
            setCalendarConnected(true);
            setSuccessMessage('Google Calendar connected successfully!');
            // Clear the query param from URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Clear success message after 5 seconds
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
        
        if (params.get('calendar_error') === 'true') {
            setError('Failed to connect Google Calendar. Please try again.');
            window.history.replaceState({}, document.title, window.location.pathname);
            
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleConnectCalendar = async () => {
        try {
            setIsConnecting(true);
            setError(null);
            
            // This will redirect to Google OAuth
            await calendarService.connectCalendar();
        } catch (err) {
            console.error('Error connecting calendar:', err);
            setError('Failed to initiate calendar connection');
            setIsConnecting(false);
        }
    };

    const handleDisconnectCalendar = async () => {
        if (!window.confirm('Are you sure you want to disconnect Google Calendar? You won\'t be able to sync job events until you reconnect.')) {
            return;
        }

        try {
            setIsDisconnecting(true);
            setError(null);
            
            await calendarService.disconnectCalendar();
            setCalendarConnected(false);
            setSuccessMessage('Google Calendar disconnected successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error disconnecting calendar:', err);
            setError('Failed to disconnect calendar');
        } finally {
            setIsDisconnecting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                    <p className="mt-2 text-slate-600">Manage your account and integrations</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Success Alert */}
                {successMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-green-700 text-sm">{successMessage}</p>
                    </div>
                )}

                {/* Google Calendar Integration Card */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-blue-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900">Google Calendar Integration</h2>
                        </div>
                        <p className="text-slate-600 text-sm ml-10">Connect your Google Calendar to automatically sync job application deadlines, interviews, and follow-ups</p>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader className="h-5 w-5 text-slate-400 animate-spin" />
                                <span className="ml-2 text-slate-600">Checking calendar status...</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Connection Status */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-3 w-3 rounded-full ${calendarConnected ? 'bg-green-500' : 'bg-slate-300'}`} />
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {calendarConnected ? 'Connected' : 'Not Connected'}
                                            </p>
                                            <p className="text-xs text-slate-600 mt-0.5">
                                                {calendarConnected 
                                                    ? 'Your Google Calendar is ready to sync job events'
                                                    : 'Connect your Google Calendar to start syncing events'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {calendarConnected ? (
                                            <Check className="h-5 w-5 text-green-600" />
                                        ) : (
                                            <X className="h-5 w-5 text-slate-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Features List */}
                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-slate-700">When connected, the following will sync to your calendar:</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span><strong>Interview Dates</strong> - When you schedule an interview for a job</span>
                                        </li>
                                        <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span><strong>Application Deadlines</strong> - Application deadlines for jobs</span>
                                        </li>
                                        <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span><strong>Follow-up Reminders</strong> - When you plan to follow up on applications</span>
                                        </li>
                                        <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span><strong>Offer Deadlines</strong> - When you need to respond to job offers</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Important Notes */}
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs text-blue-800">
                                        <strong>Note:</strong> Events will be added to your primary Google Calendar in the account you authorize. 
                                        Make sure you're logged into the correct Google Account before connecting.
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    {!calendarConnected ? (
                                        <Button
                                            onClick={handleConnectCalendar}
                                            disabled={isConnecting}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {isConnecting ? (
                                                <>
                                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                                    Connecting...
                                                </>
                                            ) : (
                                                <>
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Connect Google Calendar
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleDisconnectCalendar}
                                            disabled={isDisconnecting}
                                            variant="outline"
                                            className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                                        >
                                            {isDisconnecting ? (
                                                <>
                                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                                    Disconnecting...
                                                </>
                                            ) : (
                                                <>
                                                    <LogOut className="h-4 w-4 mr-2" />
                                                    Disconnect Calendar
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Account Information Card */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-900">Account Information</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                            <input
                                type="text"
                                value={user?.username || ''}
                                disabled
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 disabled:text-slate-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={user?.contact_email || ''}
                                disabled
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 disabled:text-slate-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
