import React from "react";


const SubmissionSuccess: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">Successfully submitted!</h2>
                <p className="mb-4">Thank you for your interest in the role, we look forward to meeting you!</p>
            </div>
        </div>
    );
}

export default SubmissionSuccess;