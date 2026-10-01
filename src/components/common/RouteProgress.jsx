import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RouteProgress() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 420);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return <div className={`route-progress ${visible ? "is-active" : ""}`} aria-hidden="true" />;
}
