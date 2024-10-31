import { useEffect, useRef } from "react";
import gavi from "../../assets/gavi.jpeg";
import lamine from "../../assets/lamine.jpg";
import pedri from "../../assets/pedri.jpg";
import bernal from "../../assets/bernal.jpg";

const images = [
  { id: "gavi", src: gavi, alt: "Gavi" },
  { id: "lamine", src: lamine, alt: "Lamine" },
  { id: "pedri", src: pedri, alt: "Pedri" },
  { id: "bernal", src: bernal, alt: "Bernal" },
];

const Rooms = () => {
  const roomsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!roomsRef.current) return;

      const images = roomsRef.current.getElementsByClassName("room_img_div");
      const containerHeight = roomsRef.current.clientHeight;

      Array.from(images).forEach((imageDiv) => {
        const img = imageDiv.getElementsByTagName("img")[0];
        if (img) {
          const rect = imageDiv.getBoundingClientRect();
          const centerPosition = containerHeight / 2;
          const fromCenter = Math.abs(
            rect.top + rect.height / 2 - centerPosition
          );
          const maxDistance = containerHeight;

          // Calculate how centered the image is (0 = centered, 1 = furthest)
          const distanceRatio = Math.min(fromCenter / maxDistance, 1);

          // Calculate scale (1.1 when centered, 0.9 when far)
          const scale = 1.1 - distanceRatio * 0.2;

          // Calculate opacity (1 when centered, 0.5 when far)
          const opacity = 1 - distanceRatio * 0.5;

          // Calculate blur (0px when centered, 2px when far)
          const blur = distanceRatio * 2;

          // Apply transformations
          img.style.transform = `scale(${scale})`;
          img.style.opacity = opacity.toString();
          img.style.filter = `blur(${blur}px)`;

          // Add or remove focused class
          if (distanceRatio < 0.3) {
            imageDiv.classList.add("focused");
          } else {
            imageDiv.classList.remove("focused");
          }
        }
      });
    };

    const roomsElement = roomsRef.current;
    if (roomsElement) {
      roomsElement.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial call

      // Add scroll snap behavior with Intersection Observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
            } else {
              entry.target.classList.remove("in-view");
            }
          });
        },
        {
          root: roomsElement,
          threshold: 0.7,
        }
      );

      Array.from(roomsElement.getElementsByClassName("room_img_div")).forEach(
        (el) => {
          observer.observe(el);
        }
      );

      return () => {
        roomsElement.removeEventListener("scroll", handleScroll);
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div className="rooms" ref={roomsRef}>
      {images.map(({ id, src, alt }) => (
        <div className="room_img_div" id={id} key={id}>
          <img src={src} alt={alt} />
        </div>
      ))}
    </div>
  );
};

export default Rooms;
