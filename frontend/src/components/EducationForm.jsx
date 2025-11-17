import { Plus, Trash2 } from 'lucide-react';

export default function EducationForm({ data, onUpdate }) {
  const addEducation = () => {
    onUpdate([
      ...data,
      { id: Date.now(), school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }
    ]);
  };

  const updateEducation = (id, field, value) => {
    onUpdate(data.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  const deleteEducation = (id) => {
    onUpdate(data.filter(edu => edu.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Education</h3>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>
      {data.map((edu) => (
        <div key={edu.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
          <div className="flex justify-between items-start">
            <input
              type="text"
              placeholder="School/University"
              value={edu.school}
              onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => deleteEducation(edu.id)}
              className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={edu.field}
              onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Start Date"
              value={edu.startDate}
              onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="End Date"
              value={edu.endDate}
              onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="GPA (optional)"
              value={edu.gpa}
              onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
}