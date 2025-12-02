import Footer from "./components/Footer";
import styles from "./home.module.scss";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";

export default async function Page() {
  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <div className={styles.hero}>
          <div style={{ marginBottom: "2rem" }}>
            <h1>Solander 38</h1>
            <h6>
              <svg
                width="59"
                height="78"
                viewBox="0 0 59 78"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.9 77.6C20 68.8 24.8 54.9 26.7 49.5H0L7.7 40.7C18.5 37.7 23.4 39.9 28.3 42C32.8 44 37.2 45.9 44.5 45.3L16.9 77.6Z"
                  fill="#000"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M42.4 0C39.3 8.8 34.5 22.7 32.6 28.1H58.9L51.7 36.8C40.8 39.9 36 37.8 31.1 35.7C26.7 33.8 22.2 31.8 15 32.4L42.4 0Z"
                  fill="#000"
                />
              </svg>
              Rising Tide Research Foundation
            </h6>
          </div>
          <img src="/images/solander-38-4.png" style={{ height: "21rem" }} />
        </div>
      </div>

      <Footer>
        <div style={{marginTop: '0.5rem'}}>
          <a href={"/stories/solander-38"}>
            Stories <LiaLongArrowAltRightSolid size={18} />{" "}
          </a>
          <h6 style={{ marginLeft: "1rem", textTransform: "none" }}>
            Details from the build, organized by anatomical system
          </h6>
          <a href={"/anatomy"}>
            Anatomy <LiaLongArrowAltRightSolid size={18} />{" "}
          </a>
          <h6 style={{ marginLeft: "1rem", textTransform: "none" }}>
            Model of parts and systems
          </h6>
          <a href={"/drawings"}>
            Drawings <LiaLongArrowAltRightSolid size={18} />{" "}
          </a>
          <h6 style={{ marginLeft: "1rem", textTransform: "none" }}>
            Library of fabrication plans
          </h6>
          <a href={"/people"}>
            People <LiaLongArrowAltRightSolid size={18} />{" "}
          </a>
          <h6 style={{ marginLeft: "1rem", textTransform: "none" }}>
            Builders, engineers, and researchers involved
          </h6>
        </div>
      </Footer>

      {/* <section className={styles.section}>
        <div>
          <div>
            <h6>
              Solander 38
              <br />
              <span style={{ textTransform: "none" }}>
                is a self-sufficient, solar-electric, coastal&nbsp;cruising
                power catamaran.
              </span>
            </h6>
            <br />
            <h6>
              Rising Tide Research Foundation
              <br />
              <span style={{ textTransform: "none" }}>
                is a not-for-profit society established to conduct open-source
                research advancing electric boat design and to raise public
                awareness and understanding of clean-marine technologies.
              </span>
            </h6>
            <br />
            <h6>
              This website
              <br />
              <span style={{ textTransform: "none" }}>
                is an effort to document and share designs, processes, and
                research from <em>Catalyst</em>, the first Solander 38.
              </span>
            </h6>
            <br />
          </div>
          
        </div>
      </section> */}
    </div>
  );
}

// export default async function Page() {
//   return (
//     <div>
//       <section>
//         <figure
//           className="page-module-scss-module__w6G8Aq__full_image"
//           style={{
//             position: "sticky",
//             top: 0,
//             width: "100vw",
//             height: "100vh",
//             overflow: "hidden",
//           }}
//         >
//           <img
//             style={{
//               maxWidth: "100%",
//               height: "auto",
//               display: "block",
//               marginTop: "-8%",
//             }}
//             alt="todo: add alt text"
//             width="4032"
//             height="3024"
//             decoding="async"
//             srcSet="https://cdn.sanity.io/images/qjczz6gi/production/e21b1aedbbe89872b8039061dd51771bb848d5eb-4032x3024.jpg?h=2880&amp;w=3840&amp;auto=format&amp;fit=min 1x"
//             src="https://cdn.sanity.io/images/qjczz6gi/production/e21b1aedbbe89872b8039061dd51771bb848d5eb-4032x3024.jpg?h=2880&amp;w=3840&amp;auto=format&amp;fit=min"
//           />
//         </figure>
//         <h1>
//           Solander 38
//         </h1>

//         {/* <div
//           style={{
//             position: "sticky",
//             background: "#fff",
//             top: "20%",
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             width: "max-content",
//             borderTop: "1px solid",
//             borderLeft: "1px solid",
//             marginLeft: "0.5rem",
//             marginBottom: "0.5rem",
//           }}
//         >
//           <h1
//             style={{
//               fontSize: "3rem",
//               textTransform: "uppercase",
//               padding: "0.5rem",
//               margin: 0,
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//               gridColumn: "span 2",
//             }}
//           >
//             Solander 38
//           </h1>
//           <h6
//             style={{
//               padding: "0.5rem",
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//             }}
//           >
//             LOA
//           </h6>
//           <h6
//             style={{
//               padding: "0.5rem",
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//             }}
//           >
//             {"38'"}
//           </h6>
//           <h6
//             style={{
//               padding: "0.5rem",
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//             }}
//           >
//             Beam
//           </h6>
//           <h6
//             style={{
//               padding: "0.5rem",
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//             }}
//           >
//             {"21'"}
//           </h6>
//           <h6
//             style={{
//               padding: "0.5rem",
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//             }}
//           >
//             solar panels
//           </h6>
//           <h6
//             style={{
//               padding: "0.5rem",
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//             }}
//           >
//             15 &times; 445W
//           </h6>
//           <h6
//             style={{
//               padding: "0.5rem",
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//             }}
//           >
//             battery bank
//           </h6>
//           <h6
//             style={{
//               padding: "0.5rem",
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//             }}
//           >
//             2 &times; 60kWh LFP
//           </h6>
//           <h6
//             style={{
//               padding: "0.5rem",
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//             }}
//           >
//             Electric motors
//           </h6>
//           <h6
//             style={{
//               padding: "0.5rem",
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//             }}
//           >
//             2 &times; 20W PMAC Evo
//           </h6>
//           <h6
//             style={{
//               padding: "0.5rem",
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//             }}
//           >
//             Cruising range
//           </h6>
//           <h6
//             style={{
//               padding: "0.5rem",
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//             }}
//           >
//             40 mile
//           </h6>
//           <h6
//             style={{
//               padding: "0.5rem",
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//             }}
//           >
//             Max speed
//           </h6>
//           <h6
//             style={{
//               padding: "0.5rem",
//               borderBottom: "1px solid",
//               borderRight: "1px solid",
//             }}
//           >
//             10 knots
//           </h6>
//         </div> */}
//         <div style={{ height: 1000 }}></div>
//         <div
//           style={{
//             position: "sticky",
//             marginTop: "3rem",
//             marginBottom: "3rem",
//             border: "1px solid",
//             top: "6rem",
//             marginLeft: "20%",
//             width: "27%",
//             transform: "translate(-50%, 0) rotate(-5deg)",
//           }}
//         >
//           <img
//             height="3400"
//             width="2200"
//             loading="lazy"
//             src="/drawings/output_images/OVERVIEW/Full boat overview Spring 2025/Solander 38 overview elevation views 4-10-25.png"
//             style={{ display: "block", maxWidth: "100%", height: "auto" }}
//           />
//           <p
//             className="uppercase-mono"
//             style={{
//               position: "absolute",
//               fontSize: "0.625rem",
//               bottom: "0px",
//               left: "0.5rem",
//             }}
//           >
//             76d6215c4ec0
//           </p>
//         </div>
//         <div style={{ height: 1000 }}></div>
//         <div
//           style={{
//             position: "sticky",
//             marginTop: "3rem",
//             marginBottom: "3rem",
//             border: "1px solid",
//             top: "17rem",
//             marginLeft: "19%",
//             width: "32%",
//             transform: "translate(-50%, 0) rotate(4deg)",
//           }}
//         >
//           <img
//             height="2200"
//             width="3400"
//             loading="lazy"
//             src="/drawings/output_images/OVERVIEW/Full boat overview Spring 2025/Solander 38 overview profile 4-10-25.png"
//             style={{ display: "block", maxWidth: "100%", height: "auto" }}
//           />
//           <p
//             className="uppercase-mono"
//             style={{
//               position: "absolute",
//               fontSize: "0.625rem",
//               bottom: "0",
//               left: "0.5rem",
//             }}
//           >
//             6edaea769f92
//           </p>
//         </div>

//         <div style={{ height: 1000 }}></div>
//         {/* <div
//           style={{
//             position: "sticky",
//             top: "13rem",
//             right: "8rem",
//             width: "30rem",
//             marginLeft: "6vw",
//           }}
//         >
//           <img
//             style={{ maxWidth: "100%", height: "auto" }}
//             width={1206}
//             height={1112}
//             src="https://cdn.sanity.io/images/qjczz6gi/production/9fdf1e4fefe623dae62a3800f9694d02806a9831-1206x1112.jpg"
//           />
//         </div>
//         <div style={{ height: 1000 }}></div>

//         <div
//           style={{
//             position: "sticky",
//             top: "34vh",
//             marginLeft: "4vw",
//             width: "28rem",
//             transform: "rotate(2deg)",
//           }}
//         >
//           <img
//             style={{ maxWidth: "100%", height: "auto" }}
//             src="https://cdn.sanity.io/images/qjczz6gi/production/e5b4783d4bb231f86b1d38819b4d1676945c5205-2256x1420.png"
//           />
//         </div>
//         <div style={{ height: 1000 }}></div>*/}
//       </section>

//       <div>
//         <Link href="/anatomy" style={{ width: "min-content" }}>
//           <img
//             style={{ display: "block", margin: "0 auto", maxWidth: "700px" }}
//             // width={1280}
//             // height={861}
//             src="/images/solander38.png"
//           />
//         </Link>
//       </div>
//       {/* <main>
//         <div className="narrow">
//           <h1 className="uppercase-mono">Solander 38</h1>
//           <p className="large">
//             A self-sufficient, solar-electric, coastal cruising power catamaran.
//           </p>
//           <figure>
//             <img
//               width={tempPhotoMapping.default.width}
//               height={tempPhotoMapping.default.height}
//               style={{ width: "100%", height: "auto" }}
//               alt="Solander 38"
//               src={tempPhotoMapping.default.url}
//             />
//             <figcaption>{tempPhotoMapping.default.caption}</figcaption>
//           </figure>
//           <p>
//             The Solander 38 was designed to bring the self-sufficiency and low
//             environmental impact of a cruising sailboat to boaters who prefer
//             the practicality and ease of motoring.
//           </p>
//           <p>
//             The goal: to be able to slowly cruise remote coastal waterways, like
//             BC’s Inside Passage, for days or weeks at a time, without ever
//             needing to wait for the right wind, take on fuel or water, or plug
//             into shore power.
//           </p>
//         </div> */}
//       {/* <div className="medium">
//           <Link href={"/anatomy"} style={{ display: "block" }}>
//             <img
//               src={"images/solander38-1.png"}
//               style={{ display: "block", width: "100%" }}
//             />
//             <div className="narrow">Anatomy &#8594;</div>
//           </Link>
//         </div> */}
//       {/* <div className="big-nav">
//           <p>
//             <Link href={"/anatomy"}>Anatomy &#8594;</Link>
//           </p>
//           <p>
//             <Link href={"/parts"}>Parts &#8594;</Link>
//           </p>
//         </div> */}
//       {/* <section className="wide">
//           <div className={`${styles.toc}`}>
//             <TableOfContents />
//           </div>
//         </section> */}
//       {/* </main> */}
//     </div>
//   );
// }
