import Footer from "./components/Footer";
import Navigation, { URLS } from "./components/Navigation/Navigation";
import "./home.scss";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import Search from "./components/Search/Search";

export default async function Page() {
  return (
    <div className={`home not-found`}>
      <Navigation type={"top-bar"} system="overview" />
      <Search />

      <main>
        <h6>Not found</h6>
      </main>
      <Footer>
        <div className={'home__toc'}>
          <section>
            <p>
              <a href={URLS.STORIES}>
                Stories <LiaLongArrowAltRightSolid size={18} />{" "}
              </a>
            </p>
            <p>Details from the build, organized by anatomical system.</p>
          </section>
          <section>
            <p>
              <a href={URLS.ANATOMY}>
                Anatomy <LiaLongArrowAltRightSolid size={18} />{" "}
              </a>
            </p>
            <p>Model of parts and systems.</p>
          </section>
          <section>
            <p>
              <a href={URLS.DRAWINGS}>
                Drawings <LiaLongArrowAltRightSolid size={18} />{" "}
              </a>
            </p>
            <p>Library of fabrication plans.</p>
          </section>
          <section>
            <p>
              <a href={URLS.PHOTOS}>
                Photos <LiaLongArrowAltRightSolid size={18} />{" "}
              </a>
            </p>
            <p>Library of photos.</p>
          </section>
          <section>
            <p>
              <a href={URLS.PEOPLE}>
                People <LiaLongArrowAltRightSolid size={18} />{" "}
              </a>
            </p>
            <p>Builders, engineers, and researchers involved.</p>
          </section>
        </div>
      </Footer>
    </div>
  );
}
