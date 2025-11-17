import { Plus, Trash2 } from 'lucide-react';

export default function ExperienceForm({ data, onUpdate }) {
  const addExperience = () => {
    onUpdate([
      ...data,
      { id: Date.now(), company: '', position: '', startDate: '', endDate: '', current: false, description: '' }
    ]);
  };

  const updateExperience = (id, field, value) => {
    onUpdate(data.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const deleteExperience = (id) => {
    onUpdate(data.filter(exp => exp.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Work Experience</h3>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>
      {data.map((exp) => (
        <div key={exp.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
          <div className="flex justify-between items-start">
            <input
              type="text"
              placeholder="Position"
              value={exp.position}
              onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => deleteExperience(exp.id)}
              className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Company"
            value={exp.company}
            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Start Date (e.g., Jan 2020)"
              value={exp.startDate}
              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="End Date"
              value={exp.endDate}
              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
              disabled={exp.current}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={exp.current}
              onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-600">Currently working here</span>
          </label>
          <textarea
            placeholder="Description"
            value={exp.description}
            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      ))}
    </div>
  );
}