import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StickyNote, Plus, X, Edit2, Trash2, Save } from 'lucide-react';

export function NotesModal({ isOpen, onClose }) {
    const [notes, setNotes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    // Load notes from localStorage on mount
    useEffect(() => {
        const savedNotes = localStorage.getItem('jobNotes');
        if (savedNotes) {
            try {
                setNotes(JSON.parse(savedNotes));
            } catch (e) {
                console.error('Error loading notes:', e);
            }
        }
    }, []);

    // Save notes to localStorage whenever notes change
    useEffect(() => {
        if (notes.length > 0 || localStorage.getItem('jobNotes')) {
            localStorage.setItem('jobNotes', JSON.stringify(notes));
        }
    }, [notes]);

    const handleAddNote = () => {
        if (newNote.title.trim() || newNote.content.trim()) {
            const note = {
                id: Date.now().toString(),
                title: newNote.title.trim() || 'Untitled Note',
                content: newNote.content.trim(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            setNotes([note, ...notes]);
            setNewNote({ title: '', content: '' });
            setShowAddForm(false);
        }
    };

    const handleEditNote = (id) => {
        const note = notes.find(n => n.id === id);
        if (note) {
            setEditingId(id);
            setNewNote({ title: note.title, content: note.content });
            setShowAddForm(true);
        }
    };

    const handleUpdateNote = () => {
        if (editingId) {
            setNotes(notes.map(note =>
                note.id === editingId
                    ? {
                        ...note,
                        title: newNote.title.trim() || 'Untitled Note',
                        content: newNote.content.trim(),
                        updatedAt: new Date().toISOString()
                    }
                    : note
            ));
            setEditingId(null);
            setNewNote({ title: '', content: '' });
            setShowAddForm(false);
        }
    };

    const handleDeleteNote = (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            setNotes(notes.filter(note => note.id !== id));
        }
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setEditingId(null);
        setNewNote({ title: '', content: '' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <Card className="shadow-2xl border-0">
                    <CardHeader className="bg-white border-b border-slate-200 relative">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <StickyNote className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-slate-900">My Notes</CardTitle>
                                    <p className="text-xs text-slate-500 mt-0.5">Tasks and reminders for your applications</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 bg-gradient-to-br from-slate-50 to-white">
                        {/* Add Note Button */}
                        {!showAddForm && (
                            <Button
                                onClick={() => setShowAddForm(true)}
                                className="w-full mb-6 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Note
                            </Button>
                        )}

                        {/* Add/Edit Note Form */}
                        {showAddForm && (
                            <div className="mb-6 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Title
                                        </label>
                                        <Input
                                            placeholder="Note title..."
                                            value={newNote.title}
                                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                            className="border-slate-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Content
                                        </label>
                                        <textarea
                                            placeholder="Write your note here..."
                                            value={newNote.content}
                                            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={editingId ? handleUpdateNote : handleAddNote}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {editingId ? 'Update Note' : 'Save Note'}
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            variant="outline"
                                            className="border-slate-300 hover:bg-slate-50"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notes List */}
                        {notes.length === 0 ? (
                            <div className="text-center py-12">
                                <StickyNote className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                                <p className="text-slate-600 font-medium">No notes yet</p>
                                <p className="text-sm text-slate-500 mt-1">Add your first note to get started</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {notes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-900 mb-1">
                                                    {note.title}
                                                </h3>
                                                <p className="text-xs text-slate-500">
                                                    {formatDate(note.updatedAt)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleEditNote(note.id)}
                                                    className="p-1.5 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600 hover:text-indigo-700"
                                                    aria-label="Edit note"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteNote(note.id)}
                                                    className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-600 hover:text-red-700"
                                                    aria-label="Delete note"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                            {note.content || <span className="text-slate-400 italic">No content</span>}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

