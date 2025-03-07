import React from 'react';

function SurveyPreview({ questions }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Survey Preview</h2>
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Question {index + 1}</h3>
            <p className="text-gray-600 mb-4">{question.text}</p>
            {question.type === 'multiple-choice' || question.type === 'checkbox' ? (
              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center space-x-2">
                    <input 
                      type={question.type === 'multiple-choice' ? 'radio' : 'checkbox'} 
                      name={`question-${index}`}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-gray-700">{option}</label>
                  </div>
                ))}
              </div>
            ) : question.type === 'long-text' ? (
              <textarea 
                placeholder="Long answer" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
              />
            ) : (
              <input 
                type="text" 
                placeholder="Short answer" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            )}
          </div>
        ))}
        {questions.length === 0 && (
          <p className="text-gray-500 text-center italic">No questions added yet</p>
        )}
      </div>
    </div>
  );
}

export default SurveyPreview;
