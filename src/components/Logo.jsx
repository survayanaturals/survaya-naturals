import logo from "../components/Banner/logo 2.png";

export default function Logo() {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Inject Google Fonts dynamically so they render perfectly */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Montserrat:wght@500;700&family=Playfair+Display:ital,wght@1,700&display=swap');
        `}
      </style>

      {/* Logo Leaf Emblem */}
      <img
        src={logo}
        alt="Survaya Naturals Emblem"
        className="h-16 w-auto object-contain"
      />

      {/* Perfectly Recreated Typography Stack */}
      <div className="flex flex-col items-center text-center">
        {/* Main Brand Name */}
        <h1
          style={{
          fontFamily: "'Playfair Display', serif", // Swapped to match the thick logo script            fontSize: "2.2rem",
            fontWeight: 700,
            fontSize:"2.0rem",
            color: "#3A2816",
            lineHeight: "0.95"
          }}
          className="italic" // Makes "Survaya" beautifully cursive-styled like the image
        >
          Survaya
        </h1>

        {/* NATURALS with Side Hyphen Lines */}
        <div className="flex items-center w-full justify-center gap-1.5 my-0.5">
          <span className="h-[1px] w-3 bg-bark-400 opacity-60"></span>
          <div
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.6rem",
              alignItems:'center',
              letterSpacing: "0.25em",
              color: "#3A2816", // Darker tint matching the image text
              fontWeight: 750
            }}
          >
            NATURALS
          </div>
          <span className="h-[1px] w-3 bg-bark-400 opacity-60"></span>
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.68rem",
            color: "#5C4D3C",
            fontWeight: 550,
            letterSpacing: "0.02em"
          }}
          className="mt-0.5"
        >
          Homemade Goodness
        </div>
      </div>
    </div>
  );
}