"use client";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#8b3f1f",
        color: "#f5f0e8",
        padding: "60px 48px 30px",
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      {/* TOP GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr 1.5fr",
          gap: 40,
        }}
      >
        {/* COLUMN 1 */}
        <div>
          <h4 style={title}>What's Popular</h4>
          {[
            "Under the bed Storage",
            "Spill-Resistant Furniture",
            "Solid Wood Furniture",
            "Small Sofas",
            "Small Dining Tables",
            "Storage Solutions",
            "Modern Farmhouse",
            "Kid-Friendly Furniture",
          ].map((item, i) => (
            <p key={i} style={link}>{item}</p>
          ))}
        </div>

        {/* COLUMN 2 */}
        <div>
          <h4 style={title}>About Us</h4>
          {[
            "Our Story",
            "Contact Us",
            "Sustainability",
            "Trade Program",
            "Ambassador Program",
            "Affiliate Program",
            "Careers",
            "Blog",
            "Press",
          ].map((item, i) => (
            <p key={i} style={link}>{item}</p>
          ))}
        </div>

        {/* COLUMN 3 */}
        <div>
          <h4 style={title}>Shopping With Us</h4>
          {[
            "My Rewards",
            "Refer a Friend",
            "Free Swatches",
            "Delivery",
            "Product Guarantee",
            "Sales and Refunds",
            "Help Center",
            "Try Web AR",
          ].map((item, i) => (
            <p key={i} style={link}>{item}</p>
          ))}
        </div>

        {/* COLUMN 4 */}
        <div>
          <h4 style={title}>Enjoy £50 off your first order</h4>

          {/* EMAIL INPUT */}
          <div style={{ position: "relative", marginTop: 16 }}>
            <input
              placeholder="Enter your email"
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.5)",
                padding: "10px 40px 10px 0",
                color: "#fff",
                outline: "none",
                fontSize: 14,
              }}
            />
            <button
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                background: "#f5f0e8",
                color: "#8b3f1f",
                cursor: "pointer",
              }}
            >
              →
            </button>
          </div>

          {/* SOCIAL */}
          <div style={{ marginTop: 30 }}>
            <h4 style={title}>Social</h4>
            <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
              {["f", "p", "ig"].map((icon, i) => (
                <div
                  key={i}
                  style={{
                    width: 28,
                    height: 28,
                    border: "1px solid rgba(255,255,255,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {icon}
                </div>
              ))}
            </div>

            <p style={{ marginTop: 12, fontSize: 12 }}>
              #AtHomewithCastlery
            </p>
          </div>

          {/* LOGO */}
          <div
            style={{
              marginTop: 30,
              border: "1px solid rgba(255,255,255,0.6)",
              padding: 20,
              textAlign: "center",
              letterSpacing: "0.4em",
              fontSize: 18,
            }}
          >
            MODO
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.3)",
          marginTop: 50,
          paddingTop: 20,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
          fontSize: 13,
        }}
      >
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {[
            "Privacy",
            "Terms",
            "Promo Terms*",
            "The Castlery Club Terms",
            "Sitemap",
            "Accessibility Statement",
            "Cookies",
          ].map((item, i) => (
            <span key={i} style={{ cursor: "pointer" }}>{item}</span>
          ))}
        </div>

        <div>© 2026 Castlery. All rights reserved.</div>
      </div>
    </footer>
  );
}

const title = {
  fontSize: 18,
  marginBottom: 14,
};

const link = {
  margin: "6px 0",
  fontSize: 14,
  cursor: "pointer",
  opacity: 0.9,
};