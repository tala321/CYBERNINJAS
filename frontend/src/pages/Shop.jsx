import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const shopItems = [
  {
    id: 1,
    name: "Shadow Mask",
    nameAr: "قناع الظل",
    category: "Mask",
    icon: "🥷",
    price: 120,
    rarity: "Rare",
    description: "A mysterious mask for stealthy cyber ninjas.",
  },
  {
    id: 2,
    name: "Cyber Hoodie",
    nameAr: "سترة السايبر",
    category: "Outfit",
    icon: "🧥",
    price: 180,
    rarity: "Epic",
    description: "A cool cyber hoodie for your ninja avatar.",
  },
  {
    id: 3,
    name: "Neon Visor",
    nameAr: "نظارة النيون",
    category: "Accessory",
    icon: "🕶️",
    price: 150,
    rarity: "Rare",
    description: "Scan the digital world in style.",
  },
  {
    id: 4,
    name: "Golden Headband",
    nameAr: "العصابة الذهبية",
    category: "Accessory",
    icon: "🥇",
    price: 250,
    rarity: "Legendary",
    description: "A legendary headband for elite ninjas.",
  },
  {
    id: 5,
    name: "Cyber Backpack",
    nameAr: "حقيبة السايبر",
    category: "Accessory",
    icon: "🎒",
    price: 100,
    rarity: "Common",
    description: "Carry your cyber gear wherever you go.",
  },
  {
    id: 6,
    name: "Electric Aura",
    nameAr: "هالة كهربائية",
    category: "Effect",
    icon: "⚡",
    price: 300,
    rarity: "Legendary",
    description: "Surround your ninja with an electric aura.",
  },
  {
    id: 7,
    name: "Cyber Sword",
    nameAr: "سيف السايبر",
    category: "Accessory",
    icon: "⚔️",
    price: 220,
    rarity: "Epic",
    description: "A futuristic cyber blade.",
  },
  {
    id: 8,
    name: "Pixel Wings",
    nameAr: "أجنحة البيكسل",
    category: "Effect",
    icon: "🪽",
    price: 350,
    rarity: "Legendary",
    description: "Digital wings made from pure cyber energy.",
  },
];

const categories = ["All", "Outfit", "Mask", "Accessory", "Effect"];

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [coins, setCoins] = useState(850);
  const [ownedItems, setOwnedItems] = useState([]);

  const filteredItems =
    selectedCategory === "All"
      ? shopItems
      : shopItems.filter((item) => item.category === selectedCategory);

  const handlePurchase = (item) => {
    if (ownedItems.includes(item.id)) {
      return;
    }

    if (coins < item.price) {
      alert("Not enough Cyber Coins!");
      return;
    }

    setCoins((current) => current - item.price);
    setOwnedItems((current) => [...current, item.id]);
  };

  return (
    <div className="shop-page">
      <div className="shop-background">
        <div className="shop-glow shop-glow-one" />
        <div className="shop-glow shop-glow-two" />
        <div className="shop-grid" />
      </div>

      <header className="shop-header">
        <Link to="/dashboard" className="shop-logo">
          <span className="shop-logo-icon">🥷</span>

          <span>
            <strong>CYBER</strong>
            <em>NINJAS</em>
          </span>
        </Link>

        <div className="shop-header-actions">
          <div className="shop-coins">
            <span className="shop-coin-icon">🪙</span>
            <div>
              <small>CYBER COINS</small>
              <strong>{coins}</strong>
            </div>
          </div>

          <Link to="/profile" className="shop-profile-button">
            👤 Profile
          </Link>
        </div>
      </header>

      <main className="shop-main">
        <motion.section
          className="shop-hero"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="shop-hero-content">
            <span className="shop-kicker">CYBERNINJAS REWARDS</span>

            <h1>
              Ninja <span>Shop</span>
            </h1>

            <p>
              Upgrade your ninja, unlock awesome items, and show your cyber
              style.
            </p>

            <div className="shop-hero-stats">
              <div>
                <strong>{ownedItems.length}</strong>
                <span>Items Owned</span>
              </div>

              <div>
                <strong>{shopItems.length}</strong>
                <span>Items Available</span>
              </div>

              <div>
                <strong>{coins}</strong>
                <span>Coins</span>
              </div>
            </div>
          </div>

          <motion.div
            className="shop-hero-ninja"
            animate={{
              y: [0, -10, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="shop-ninja-aura" />
            <div className="shop-ninja-card">🥷</div>
          </motion.div>
        </motion.section>

        <section className="shop-content">
          <div className="shop-section-heading">
            <div>
              <span>EXPLORE THE COLLECTION</span>
              <h2>Customize Your Ninja</h2>
            </div>

            <Link to="/profile/avatar" className="shop-customize-link">
              ✨ Customize Avatar
            </Link>
          </div>

          <div className="shop-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category
                    ? "shop-filter active"
                    : "shop-filter"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category === "All" && "✨ "}
                {category === "Outfit" && "🧥 "}
                {category === "Mask" && "🥷 "}
                {category === "Accessory" && "🎒 "}
                {category === "Effect" && "⚡ "}
                {category}
              </button>
            ))}
          </div>

          <div className="shop-grid-items">
            {filteredItems.map((item, index) => {
              const owned = ownedItems.includes(item.id);

              return (
                <motion.article
                  key={item.id}
                  className={`shop-item-card ${owned ? "owned" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.05,
                  }}
                  whileHover={{
                    y: -8,
                  }}
                >
                  <div className="shop-item-top">
                    <span
                      className={`shop-rarity rarity-${item.rarity.toLowerCase()}`}
                    >
                      {item.rarity}
                    </span>

                    {owned && (
                      <span className="shop-owned">
                        ✓ Owned
                      </span>
                    )}
                  </div>

                  <div className="shop-item-visual">
                    <div className="shop-item-glow" />
                    <span>{item.icon}</span>
                  </div>

                  <div className="shop-item-info">
                    <span className="shop-item-category">
                      {item.category}
                    </span>

                    <h3>{item.name}</h3>

                    <p className="shop-item-ar">{item.nameAr}</p>

                    <p className="shop-item-description">
                      {item.description}
                    </p>
                  </div>

                  <div className="shop-item-footer">
                    <div className="shop-item-price">
                      <span>🪙</span>
                      <strong>{item.price}</strong>
                    </div>

                    <button
                      className={
                        owned
                          ? "shop-buy-button owned-button"
                          : "shop-buy-button"
                      }
                      disabled={owned}
                      onClick={() => handlePurchase(item)}
                    >
                      {owned ? "Owned ✓" : "Buy"}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="shop-bottom-banner">
          <div>
            <span>KEEP LEARNING</span>
            <h2>Earn more Cyber Coins!</h2>
            <p>
              Complete lessons, challenges, missions and boss fights to earn
              rewards.
            </p>
          </div>

          <Link to="/dashboard" className="shop-dashboard-button">
            🚀 Continue Learning
          </Link>
        </section>
      </main>
    </div>
  );
}

export default Shop;