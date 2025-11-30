import { useState, useEffect, useRef } from 'react';
import { Eye } from 'lucide-react';
import PersonalInfoForm from './PersonalInfoForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import ProjectsForm from './ProjectsForm';
import ResumePreview from './ResumePreview';
import { resumeService } from '@/services/resumeService';

export default function ResumeBuilder() {
  const [activeSection, setActiveSection] = useState('personal');
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Store debounce timers per section using useRef
  const debounceTimersRef = useRef({});
  
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  useEffect(() => {
    loadResumeData();
    
    // Cleanup: clear debounce timers on unmount
    return () => {
      Object.values(debounceTimersRef.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  const loadResumeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resumeService.getResume();
      setResumeData(data);
    } catch (error) {
      console.error('Error loading resume:', error);
      setError(error.message || 'Failed to load resume');
      // Keep default empty state on error
    } finally {
      setLoading(false);
    }
  };

  const updateResumeData = async (section, data) => {
    const updated = { ...resumeData, [section]: data };
    // Optimistically update local state immediately to keep typing smooth
    setResumeData(updated);

    // Debounce actual network saves per section to avoid frequent requests
    const existingTimer = debounceTimersRef.current[section];
    if (existingTimer) clearTimeout(existingTimer);

    // Schedule save after a short pause in typing
    debounceTimersRef.current[section] = setTimeout(async () => {
      try {
        setSaving(true);
        setError(null);

        switch (section) {
          case 'personal':
            await resumeService.updatePersonalInfo(data);
            break;
          case 'experience':
            await resumeService.updateExperience(data);
            break;
          case 'education':
            await resumeService.updateEducation(data);
            break;
          case 'skills':
            await resumeService.updateSkills(data);
            break;
          case 'projects':
            await resumeService.updateProjects(data);
            break;
          default:
            await resumeService.saveResume(updated);
        }
      } catch (error) {
        console.error('Error saving resume:', error);
        setError(error.message || 'Failed to save resume');
        // Do not aggressively revert the user's typing; keep optimistic state.
      } finally {
        setSaving(false);
      }
    }, 700);
  };

  if (previewMode) {
    return (
      <ResumePreview 
        resumeData={resumeData} 
        onBack={() => setPreviewMode(false)} 
      />
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Resume Builder</h2>
          {saving && (
            <p className="text-sm text-slate-500 mt-1">Saving...</p>
          )}
          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}
        </div>
        <button
          onClick={() => setPreviewMode(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          disabled={saving}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>

      <div className="flex border-b border-slate-200">
        {['personal', 'experience', 'education', 'skills', 'projects'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-6 py-3 font-medium capitalize transition-colors ${
              activeSection === section
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeSection === 'personal' && (
          <PersonalInfoForm
            data={resumeData.personal}
            onUpdate={(data) => updateResumeData('personal', data)}
          />
        )}

        {activeSection === 'experience' && (
          <ExperienceForm
            data={resumeData.experience}
            onUpdate={(data) => updateResumeData('experience', data)}
          />
        )}

        {activeSection === 'education' && (
          <EducationForm
            data={resumeData.education}
            onUpdate={(data) => updateResumeData('education', data)}
          />
        )}

        {activeSection === 'skills' && (
          <SkillsForm
            data={resumeData.skills}
            onUpdate={(data) => updateResumeData('skills', data)}
          />
        )}

        {activeSection === 'projects' && (
          <ProjectsForm
            data={resumeData.projects}
            onUpdate={(data) => updateResumeData('projects', data)}
          />
        )}
      </div>
    </div>
  );
}