export function MessageNotification({ message, type = 'success' }) {
    if (!message) return null;

    const styles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800'
    };

    return (
        <div className={`mb-4 p-4 border rounded-lg shadow-sm ${styles[type]}`}>
            {message}
        </div>
    );
}

