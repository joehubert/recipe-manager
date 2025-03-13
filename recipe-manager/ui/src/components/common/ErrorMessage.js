import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({
    message = 'Something went wrong',
    retry = null,
    fullPage = false
}) => {
    const content = (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-center">
            <div className="flex justify-center mb-2">
                <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-700 mb-4">{message}</p>

            {retry && (
                <button
                    onClick={retry}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                </button>
            )}
        </div>
    );

    if (fullPage) {
        return (
            <div className="flex items-center justify-center h-full min-h-[300px]">
                <div className="max-w-md w-full">{content}</div>
            </div>
        );
    }

    return content;
};

export default ErrorMessage;