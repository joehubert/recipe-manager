import React from 'react';

const Loading = ({ fullPage = false }) => {
    if (fullPage) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );
};

export default Loading;