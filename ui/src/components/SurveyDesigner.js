import React, { useState } from 'react';
import QuestionDesigner from './QuestionDesigner';
import QuestionPreview from './QuestionPreview';

function SurveyDesigner() {
  const [questions, setQuestions] = useState([]);

  const addQuestion = (question) => {
    setQuestions([...questions, question]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Survey Designer</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuestionDesigner onAddQuestion={addQuestion} />
          <QuestionPreview questions={questions} />
        </div>
      </div>
    </div>
  );
}

export default SurveyDesigner; 