import { useState, useMemo, useEffect } from 'react';
import { ItemModal } from "./components/latest/ItemModal";
import { ManageSectionModal } from "./components/latest/SectionModal";
import Sidebar from './components/latest/Sidebar';
import Navbar from './components/latest/Navbar';
import ContentArea from "./components/latest/ContentArea";
import toast from "react-hot-toast";
import { LoginModal } from './components/latest/LoginModal';
import { mockApianother } from './components/latest/mockApi';
import { AddCategoryModal } from './components/latest/CategoryModal';


// --- Mock API Service (Simulating Node.js backend calls) ---
const mockApi = {
  fetchSections: async () => {
    // Simulate GET /api/sections
    // return new Promise(resolve => setTimeout(() => resolve(INITIAL_SECTIONS), 500));
  },
  fetchItems: async () => {
    // Simulate GET /api/items
    // return new Promise(resolve => setTimeout(() => resolve(INITIAL_ITEMS), 500));
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
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState(null);
  const [sections, setSections] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeSolutionId, setActiveSolutionId] = useState(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setcategories] = useState(null);


  // Modal States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSection, setEditingSection] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleAddCategory = async (name) => {
    try {
      let res = await mockApianother.addCategory(name);
        toast.success("Category Added");
    } catch (error) {
      console.log(error)
    }
  };

  // --- Initial Data Fetching (Demo API calls) ---
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem('notesUser'));
    if (user) setUser(user)
  }, []);

  function logout() {
    localStorage.removeItem('notesUser');
    setUser(null)
  }

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
    items.find(i => i._id === selectedItemId) || filteredItems[0] || null
    , [items, selectedItemId, filteredItems]);


  useEffect(() => {
    // console.log(currentItem?.solutions[0])
    if (currentItem?.solutions?.length > 0) {
      if (!activeSolutionId || !currentItem.solutions.find(s => s._id === activeSolutionId)) {
        setActiveSolutionId(currentItem.solutions[0]._id);
      }
    }
  }, [currentItem]);

  const loadData = async () => {
    setIsLoading(true);

    try {

      const fetchedCatergory = await mockApianother.getCategory();

      const newCategories = fetchedCatergory.data.categories;
      const newSections = fetchedCatergory.data.sections;
      const newItems = fetchedCatergory.data.items;

      setcategories(newCategories);
      setSections(newSections);
      setItems(newItems);

      // ---- CATEGORY ----
      if (activeCategory) {
        const stillExists = newCategories.find(c => c._id === activeCategory);
        if (!stillExists && newCategories.length > 0) {
          setActiveCategory(newCategories[0]._id);
        }
      } else if (newCategories.length > 0) {
        setActiveCategory(newCategories[0]._id);
      }

      // ---- ITEM ----
      if (selectedItemId) {
        const stillExists = newItems.find(i => i._id === selectedItemId);
        if (!stillExists && newItems.length > 0) {
          setSelectedItemId(newItems[0]._id);
        }
      } else if (newItems.length > 0) {
        setSelectedItemId(newItems[0]._id);
      }

    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers ---
  const handleToggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleSaveSection = async (data) => {
    let { category, name, type } = data;

    try {
      let res;
      if (editingSection) {
        // console.log(editingSection)
        let sectionId = editingSection._id;
        res = await mockApianother.editsection({ category, name, type, sectionId })
      } else {
        res = await mockApianother.addsection(category, name, type)
      }
      loadData()
    } catch (error) {
      console.log(error)
    }

    setIsSectionModalOpen(false);
    setEditingSection(null);
  };

  const handleDeleteSection = async (id) => {
    if (confirm("Are you sure? This will delete the section.")) {
      let res = await mockApianother.deletesection({ sectionId: id })

      loadData()
    }

  };

  const loginapi = async (data) => {
    let { email, password } = data
    try {
      let res = await mockApianother.login(email, password);
      // console.log(res)
      setUser(res);
      localStorage.setItem('notesUser', JSON.stringify(res))
      setShowLogin(false)
      // alert('Login Successfull')
      toast.success("Login successful 🎉");
    } catch (error) {
      toast.error(error.message);
      console.log(error)
    }
  }

  const handleSaveItem = async (data) => {
    try {
      let res;
      if (editingItem) {
        // console.log(editingItem)
        let itemId = editingItem._id
        res = await mockApianother.edititems(data, itemId)
        toast.success("Edited Successfully");
      } else {
        res = await mockApianother.additems(data)
        toast.success("Added Successfully");
      }

      loadData()
    } catch (error) {
      console.log(error)
    }

    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = async (id) => {

    if (confirm("Delete this entry?")) {
      let res = await mockApianother.deleteitem({ itemId: id });
      toast.success("Deleted Successfully");
      loadData()
    }
  };
  const activeCatageoryfull = categories?.filter((val)=> {
    return val._id == activeCategory 
  })

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <Navbar
        theme={theme}
        user={user}
        logout={logout}
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
          user={user}
          setSearch={setSearch}
          setIsItemModalOpen={setIsItemModalOpen}
          filteredSections={filteredSections}
          filteredItems={filteredItems}
          selectedItemId={selectedItemId}
          setSelectedItemId={setSelectedItemId}
          setEditingSection={setEditingSection}
          setIsSectionModalOpen={setIsSectionModalOpen}
          handleDeleteSection={handleDeleteSection}
          categoryName ={activeCatageoryfull }
        />

        <ContentArea
          currentItem={currentItem}
          sections={sections}
          user={user}
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
        categoryName ={activeCatageoryfull }
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