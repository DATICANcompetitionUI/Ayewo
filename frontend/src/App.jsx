import { NavLink, Outlet } from 'react-router-dom'
import Header from './components/Header';
import {useEffect, useState} from 'react';


const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/single-screening', label: 'Single Screening' },
  { to: '/batch-screening', label: 'Batch Screening' },
]

// const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

// Handle HTML document theme classes
  // useEffect(() => {
  //   if (theme === "dark") {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  //   localStorage.setItem("theme", theme);
  // }, [theme]);

  // const toggleTheme = () => {
  //   setTheme(theme === "dark" ? "light" : "dark");
  // };

function App({ theme, toggleTheme }) {
  return (
    <div className=" bg-slate-100 text-slate-900">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App
