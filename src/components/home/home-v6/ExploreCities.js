"use client";
import Image from "next/image";
import Link from "next/link";

const CITIES = [
  { name: "Lekki",           image: "/images/cities/Abuja.jpg" },
  { name: "Ikoyi",           image: "/images/cities/Eko-Atlantic.jpg" },
  { name: "Victoria Island", image: "/images/cities/Ibeju-Lekki.jpg" },
  { name: "Ikeja",           image: "/images/cities/Ikoyi.jpg" },
  { name: "Abuja",            image: "/images/cities/VI.jpg" },
];

export default function ExploreCities() {
  return (
    <div className="row g-3">
      {CITIES.map((c, i) => {
        const lg = i < 3 ? "col-lg-4" : "col-lg-6"; // top 3, bottom 2 wider
        return (
          <div key={c.name} className={`col-12 col-md-6 ${lg}`}>
            <Link
              href={`/properties?location=${encodeURIComponent(c.name)}`}
              className="city-card d-block"
              aria-label={`See properties in ${c.name}`}
              tabIndex={0}
            >
              <div className="media">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="img"
                  sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"
                  priority={false}
                />

                {/* hover arrow */}
                <span className="hover-arrow" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H9M17 7V15"
                      stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>

                {/* rising overlay */}
                <span className="overlay" aria-hidden="true" />

                {/* label */}
                <div className="label">
                  <div className="name">{c.name}</div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}

      <style jsx>{`
        /* equal heights */
        .media{
          position: relative;
          height: 240px;
          border-radius: 14px;
          overflow: hidden;
          isolation: isolate;
          background: #0f172a;
        }
        @media (min-width: 768px){ .media{ height: 280px; } }
        @media (min-width: 1200px){ .media{ height: 320px; } }

        .city-card{ display:block; border-radius:14px; }
        .img{ object-fit: cover; object-position: center; }

        /* layers */
        .hover-arrow,
        .overlay,
        .label { pointer-events: none; }  /* let .media receive :hover */

        .hover-arrow{
          position:absolute; top:10px; right:10px;
          width:34px; height:34px; display:grid; place-items:center;
          color:#fff; background: rgba(15,23,42,.45);
          border:1px solid rgba(255,255,255,.25);
          border-radius:999px; backdrop-filter: blur(2px);
          opacity:0; transform: translateY(-6px) scale(.96);
          transition: opacity .2s ease, transform .2s ease;
          z-index:3;
        }

        .overlay{
          position:absolute; inset:0;
          background: rgba(0,0,0,.6);
          transform: translateY(100%);
          transition: transform .28s ease;
          z-index:1;
          will-change: transform;
        }

        .label{
          position:absolute; left:16px; right:16px; bottom:16px;
          color:#fff; font-weight:800;
          opacity:0; transform: translateY(12px);
          transition: opacity .22s ease, transform .22s ease;
          z-index:2; text-shadow: 0 2px 6px rgba(0,0,0,.35);
        }
        .name{ font-size:20px; line-height:1.2; }
        @media (min-width:1200px){ .name{ font-size:22px; } }

        /* HOVER/FOCUS TRIGGERS — target the actual box under the pointer */
        .media:hover .overlay,
        .city-card:focus-within .overlay { transform: translateY(0); }

        .media:hover .label,
        .city-card:focus-within .label {
          opacity:1; transform: translateY(0);
        }

        .media:hover .hover-arrow,
        .city-card:focus-within .hover-arrow {
          opacity:1; transform: translateY(0) scale(1);
        }
      `}</style>
    </div>
  );
}
