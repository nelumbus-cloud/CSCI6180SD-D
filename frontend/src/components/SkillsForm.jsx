import { Plus, Trash2 } from 'lucide-react';

export default function SkillsForm({ data, onUpdate }) {
  const addSkill = () => {
    onUpdate([...data, { id: Date.now(), name: '', level: 'intermediate' }]);
  };

  const updateSkill = (id, field, value) => {
    onUpdate(data.map(skill => skill.id === id ? { ...skill, [field]: value } : skill));
  };

  const deleteSkill = (id) => {
    onUpdate(data.filter(skill => skill.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
        <button
          onClick={addSkill}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((skill) => (
          <div key={skill.id} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Skill name"
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => deleteSkill(skill.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}