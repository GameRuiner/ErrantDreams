import React from "react";
import styles from "../css/index-page.module.css";

const IndexPage: React.FC = () => {
  return (
    <section className={`${styles.section} max-w-4xl mx-auto px-6 py-12 rounded-2xl shadow-lg`}>
      <h1 className={`text-4xl font-extrabold mb-4 text-center`}>
        Welcome to the Errant Dreams
      </h1>
      <p className="text-lg leading-relaxed mb-6">
        In a world broken by holy war and veiled in forgotten magic, your fate lies unwritten.  
        Hailing from the sun-drenched hills and rugged frontiers of Iberia to the scorched sands of the Moor, choose one of six paths — Knight, Arbalist, Skirmisher, Blade Dancer, Alchemist, or Mystic Poet — each offering a unique way to shape your destiny. Will you fight for the Crusaders or rise with the Moors in this clash of cultures and steel?
      </p>
      <p className="text-lg leading-relaxed mb-6">
        Choose your allegiance, master unique weaponry, and uncover long-buried secrets across a living, text-driven world shaped by your actions.
      </p>
      <p className="text-lg italic mb-8 text-center">
        Every decision matters. Every word leaves a mark.
      </p>

      <div className="text-center">
        <a href="/auth" className="px-6 py-3 font-semibold rounded-xl shadow-md transition">
          Enter the realm
        </a>
      </div>
    </section>
  );
};


export default IndexPage;
