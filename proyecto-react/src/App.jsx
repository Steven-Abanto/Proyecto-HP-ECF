import { useState } from 'react'
import {Routes, Route} from 'react-router'
import './App.css'

//Import de componentes y paginas
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import FAQ from './pages/FAQ/FAQ.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'
import Login from './pages/Login/Login.jsx'
import Accounts from './pages/Accounts/Accounts.jsx'
import Transfers from './pages/Transfers/Transfers.jsx'
import Loans from './pages/Loans/Loans.jsx'
import Contact from './pages/Contact/Contact.jsx'
import About from './pages/About/About.jsx'
import TransfersHistory from './pages/Transfers/TransHistory.jsx'
import LoanHistory from './pages/Loans/LoansHistory.jsx'

function App() {

  return (
    <div className="fuente-1" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{ flex: 1 }}>

        {/* Rutas de la aplicacion */}
        <Routes>
           <Route path="/" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/loanshist" element={<LoanHistory />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/transhist" element={<TransfersHistory />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App
