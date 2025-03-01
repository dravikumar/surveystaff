import React, { useState } from 'react';
import { Plus, Minus, Save } from 'lucide-react';

function QuestionDesigner({ onAddQuestion }) {
  const [questionType, setQuestionType] = useState('multiple-choice');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['Option 1']);

  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`]);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddQuestion({
      type: questionType,
      text: questionText,
      options: options
    });
    setQuestionText('');
    setOptions(['Option 1']);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Design Your Question</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Type:
          </label>
          <select 
            value={questionType} 
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="checkbox">Checkbox List</option>
            <option value="short-text">Short Text</option>
            <option value="long-text">Long Text</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Text:
          </label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {(questionType === 'multiple-choice' || questionType === 'checkbox') && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Options:</label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  type="button" 
                  onClick={() => removeOption(index)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Minus size={20} />
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addOption}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Option
            </button>
          </div>
        )}
        <button 
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <Save size={20} className="mr-2" />
          Add Question
        </button>
      </form>
    </div>
  );
}

export default QuestionDesigner;
