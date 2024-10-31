import { useState, useEffect } from "react";
import { sections } from "../../constants";
import "./styles.css";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("gavi");
  const [scrolling, setScrolling] = useState(false); // State to control observer

  useEffect(() => {
    // Map over sections to get the DOM elements of each section by its ID
    const sectionElements = sections.map((item) =>
      document.getElementById(item.id)
    );

    // Initialize an IntersectionObserver to observe when sections enter or exit the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (!scrolling) {
          // Only update when not manually scrolling
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveItem(entry.target.id);
            }
          });
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    // Attach the observer to each section element
    sectionElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    // Cleanup function to unobserve all sections when the component unmounts
    return () => {
      sectionElements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [scrolling]); // Run effect on scrolling state change

  const handleClick = (id: string) => {
    setScrolling(true); // Disable observer temporarily
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveItem(id);

      // Re-enable the observer after scrolling completes
      setTimeout(() => setScrolling(false), 500); // Adjust time if needed
    }
  };

  return (
    <div className="sidebar">
      <h1 className="heading_txt">
        <span className="heading_txt_p1">Barca</span>
        <span className="heading_txt_p2">BD</span>
      </h1>
      <div className="nav_items">
        {sections.map((item) => (
          <div className="nav_item" key={item.id}>
            <a
              href={`#${item.id}`}
              className={`${
                activeItem === item.id ? "nav_active_link" : "nav_inactive_link"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleClick(item.id);
              }}
            >
              {item.label}
            </a>
          </div>
        ))}
      </div>
      <button
        className="fcb_btn"
        onClick={() => window.open("https://www.fcbarcelona.com", "_blank")}
      >
        FCB Official Website
      </button>
    </div>
  );
};

export default Sidebar;
