import React, { useState, useRef, useEffect } from 'react';
import QuestionDesigner from './QuestionDesigner';
import SurveyPreview from './SurveyPreview';

function SurveyDesigner() {
  const [questions, setQuestions] = useState([]);
  const previewRef = useRef(null);

  const addQuestion = (question) => {
    setQuestions([...questions, question]);
  };

  // Scroll to bottom of preview when a new question is added
  useEffect(() => {
    if (questions.length > 0 && previewRef.current) {
      const previewContainer = previewRef.current;
      previewContainer.scrollTop = previewContainer.scrollHeight;
    }
  }, [questions]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Survey Designer</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* QuestionDesigner takes 1/3 of the space and stays sticky */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start">
            <QuestionDesigner onAddQuestion={addQuestion} />
          </div>
          
          {/* SurveyPreview takes 2/3 of the space and scrolls */}
          <div 
            ref={previewRef} 
            className="lg:col-span-8 max-h-[calc(100vh-8rem)] overflow-y-auto"
          >
            <SurveyPreview questions={questions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurveyDesigner; 