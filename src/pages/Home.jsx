import { useState, useMemo, useEffect } from 'react';
import { ItemModal } from "../components/ItemModal";
import { ManageSectionModal } from "../components/SectionModal";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ContentArea from "../components/ContentArea";
import toast from "react-hot-toast";
import { LoginModal } from '../components/LoginModal';
import { mockApianother } from '../services/mockApi';
import { AddCategoryModal } from '../components/CategoryModal';

export default function Home() {
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // URL Sync
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let changed = false;
    
    if (activeCategory && urlParams.get('category') !== activeCategory) {
      urlParams.set('category', activeCategory);
      changed = true;
    }
    if (selectedItemId && urlParams.get('item') !== selectedItemId) {
      urlParams.set('item', selectedItemId);
      changed = true;
    }
    
    if (changed) {
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [activeCategory, selectedItemId]);

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

      // ---- URL PARSING ----
      const urlParams = new URLSearchParams(window.location.search);
      const urlCategory = urlParams.get('category');
      const urlItem = urlParams.get('item');

      let defaultCategory = activeCategory;
      if (urlCategory && newCategories.find(c => c._id === urlCategory)) {
        defaultCategory = urlCategory;
      }

      // ---- CATEGORY ----
      if (defaultCategory) {
        const stillExists = newCategories.find(c => c._id === defaultCategory);
        if (!stillExists && newCategories.length > 0) {
          setActiveCategory(newCategories[0]._id);
        } else if (stillExists) {
          setActiveCategory(defaultCategory);
        }
      } else if (newCategories.length > 0) {
        setActiveCategory(newCategories[0]._id);
      }

      let defaultItem = selectedItemId;
      if (urlItem && newItems.find(i => i._id === urlItem)) {
        defaultItem = urlItem;
      }

      // ---- ITEM ----
      if (defaultItem) {
        const stillExists = newItems.find(i => i._id === defaultItem);
        if (!stillExists && newItems.length > 0) {
          setSelectedItemId(newItems[0]._id);
        } else if (stillExists) {
          setSelectedItemId(defaultItem);
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
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950">
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
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden w-full relative">
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
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
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
