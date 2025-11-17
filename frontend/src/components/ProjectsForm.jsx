import { Plus, Trash2 } from 'lucide-react';

export default function ProjectsForm({ data, onUpdate }) {
  const addProject = () => {
    onUpdate([
      ...data,
      { id: Date.now(), name: '', description: '', technologies: '', link: '' }
    ]);
  };

  const updateProject = (id, field, value) => {
    onUpdate(data.map(proj => proj.id === id ? { ...proj, [field]: value } : proj));
  };

  const deleteProject = (id) => {
    onUpdate(data.filter(proj => proj.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Projects</h3>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>
      {data.map((proj) => (
        <div key={proj.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
          <div className="flex justify-between items-start">
            <input
              type="text"
              placeholder="Project Name"
              value={proj.name}
              onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => deleteProject(proj.id)}
              className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            placeholder="Description"
            value={proj.description}
            onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Technologies (e.g., React, Node.js, PostgreSQL)"
            value={proj.technologies}
            onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="url"
            placeholder="Project Link"
            value={proj.link}
            onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      ))}
    </div>
  );
}