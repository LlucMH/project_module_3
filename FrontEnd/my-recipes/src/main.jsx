import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index.jsx'
import RecipePage from './pages/RecipePage.jsx'
import EditPage from './pages/EditPage.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/recipe/:id" element={<RecipePage />} />
      <Route path="/new" element={<EditPage />} />
      <Route path="/edit/:id" element={<EditPage />} />
    </Routes>
  </BrowserRouter>
)
