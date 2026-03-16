import React, { useState, useMemo, useEffect } from 'react';
import {
  Sun, Moon, Plus, Search, Code2, Copy, Check,
  Trash2, ChevronRight, Terminal, BookOpen,
  Sparkles, Edit3, Type, Layers, MoreVertical, X,
  FileText, Code, LogIn, LogOut, LayoutGrid, Cpu, Globe, Database
} from 'lucide-react';

import { ItemModal } from "./components/latest/ItemModal";
import { ManageSectionModal } from "./components/latest/ManageSectionModal";
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/latest/Sidebar';
import Navbar from './components/latest/Navbar';
import ContentArea from "./components/latest/ContentArea";
import { INITIAL_SECTIONS, INITIAL_ITEMS } from "./components/latest/sampleData";
import { LoginModal } from './components/latest/LoginModal';
import { mockApianother } from './components/latest/mockApi';
import { AddCategoryModal } from './components/latest/CategoryModal';


// --- Mock API Service (Simulating Node.js backend calls) ---
const mockApi = {
  fetchSections: async () => {
    // Simulate GET /api/sections
    return new Promise(resolve => setTimeout(() => resolve(INITIAL_SECTIONS), 500));
  },
  fetchItems: async () => {
    // Simulate GET /api/items
    return new Promise(resolve => setTimeout(() => resolve(INITIAL_ITEMS), 500));
  },
  saveItem: async (item) => {
    // Simulate POST or PATCH /api/items
    return new Promise(resolve => setTimeout(() => resolve({ ...item, id: item.id || `item-${Date.now()}` }), 300));
  },
  deleteItem: async (id) => {
    // Simulate DELETE /api/items/:id
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  },
  saveSection: async (section) => {
    // Simulate POST or PATCH /api/sections
    return new Promise(resolve => setTimeout(() => resolve({ ...section, id: section.id || `sec-${Date.now()}` }), 300));
  },
  deleteSection: async (id) => {
    // Simulate DELETE /api/sections/:id
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  }
};


export default function App() {
  const [theme, setTheme] = useState('dark');
  const [showLogin, setShowLogin] = useState(true)
  const [user, setUser] = useState(null);
  const [sections, setSections] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('dsa');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeSolutionId, setActiveSolutionId] = useState(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // const [categories, setcategories] = useState(null);

    const categories = [
    { id: 'dsa', name: 'DSA', icon: Cpu },
    { id: 'html', name: 'HTML', icon: Globe },
    { id: 'js', name: 'JS', icon: Terminal },
    { id: 'react', name: 'React', icon: Database },
  ];


  // Modal States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSection, setEditingSection] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleAddCategory = async (name) => {
    try {
      let res = await mockApianother.addCategory(name)
    } catch (error) {
      console.log(error)
    }
  };

  // --- Initial Data Fetching (Demo API calls) ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const fetchedCatergory = await mockApianother.getCategory();
        const fetchedSections = await mockApi.fetchSections();
        const fetchedItems = await mockApi.fetchItems();
        setSections(fetchedSections);
        setItems(fetchedItems);
        if (fetchedItems.length > 0) {
          setSelectedItemId(fetchedItems[0].id);
        }
        setcategories(fetchedCatergory.data)
        // console.log("fetchedCatergory", fetchedCatergory)
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Theme Sync
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Derived State
  const filteredSections = useMemo(() =>
    sections.filter(s => s.category === activeCategory),
    [sections, activeCategory]);

  const filteredItems = useMemo(() => {
    return items.filter(i =>
      i.category === activeCategory &&
      (i.title.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [items, search, activeCategory]);

  const currentItem = useMemo(() =>
    items.find(i => i.id === selectedItemId) || filteredItems[0] || null
    , [items, selectedItemId, filteredItems]);

  useEffect(() => {
    if (currentItem?.solutions?.length > 0) {
      if (!activeSolutionId || !currentItem.solutions.find(s => s.id === activeSolutionId)) {
        setActiveSolutionId(currentItem.solutions[0].id);
      }
    }
  }, [currentItem]);

  // --- Handlers ---
  const handleToggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleSaveSection = async (data) => {
    const savedSection = await mockApi.saveSection(editingSection ? { ...editingSection, ...data } : data);
    if (editingSection) {
      setSections(prev => prev.map(s => s.id === editingSection.id ? savedSection : s));
    } else {
      setSections(prev => [...prev, savedSection]);
    }
    setIsSectionModalOpen(false);
    setEditingSection(null);
  };

  const handleDeleteSection = async (id) => {
    if (confirm("Are you sure? This will delete the section.")) {
      await mockApi.deleteSection(id);
      setSections(prev => prev.filter(s => s.id !== id));
      setItems(prev => prev.filter(i => i.sectionId !== id));
    }
  };

  const loginapi = async (data) => {
    let { email, password } = data
    try {
      let res = await mockApianother.login(email, password);
      // console.log(res)
      setUser(res);
      setShowLogin(false)
      alert('Login Successfull')
    } catch (error) {
      console.log(error)
    }
  }

  const handleSaveItem = async (data) => {
    const savedItem = await mockApi.saveItem(editingItem ? { ...editingItem, ...data } : data);
    if (editingItem) {
      setItems(prev => prev.map(i => i.id === editingItem.id ? savedItem : i));
    } else {
      setItems(prev => [...prev, savedItem]);
      setSelectedItemId(savedItem.id);
    }
    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = async (id) => {
    if (confirm("Delete this entry?")) {
      await mockApi.deleteItem(id);
      const nextItems = items.filter(i => i.id !== id);
      setItems(nextItems);
      if (nextItems.length > 0) setSelectedItemId(nextItems[0].id);
    }
  };


  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <Navbar
        theme={theme}
        user={user}
        setUser={setUser}
        setShowLogin={setShowLogin}
        handleToggleTheme={handleToggleTheme}
        setEditingItem={setEditingItem}
        setIsItemModalOpen={setIsItemModalOpen}
        categories={categories}
        setIsCategoryModalOpen={setIsCategoryModalOpen}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        setSearch={setSearch}
        setSelectedItemId={setSelectedItemId}
      />

      <div className="flex h-[calc(100vh-64px)] overflow-hidden">

        <Sidebar
          isLoading={isLoading}
          search={search}
          setSearch={setSearch}
          filteredSections={filteredSections}
          filteredItems={filteredItems}
          selectedItemId={selectedItemId}
          setSelectedItemId={setSelectedItemId}
          setEditingSection={setEditingSection}
          setIsSectionModalOpen={setIsSectionModalOpen}
          handleDeleteSection={handleDeleteSection}
        />

        <ContentArea
          currentItem={currentItem}
          sections={sections}
          activeSolutionId={activeSolutionId}
          setActiveSolutionId={setActiveSolutionId}
          handleDeleteItem={handleDeleteItem}
          setEditingItem={setEditingItem}
          setIsItemModalOpen={setIsItemModalOpen}
        />

      </div>

      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        sections={filteredSections}
        activeCategory={activeCategory}
        editingItem={editingItem}
      />

      <ManageSectionModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        onSave={handleSaveSection}
        section={editingSection}
        category={activeCategory}
      />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={(data) => loginapi(data)}
      />

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />

    </div>
  );
}