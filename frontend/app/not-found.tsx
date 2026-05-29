import Footer from "./components/Footer";
import Navigation from "./components/Navigation/Navigation";
import styles from "./not-found.module.scss";
import Search from "./components/Search/Search";

export default async function Page() {

  return (
    <div className={styles["not-found"]}>
      <Navigation type={"top-bar"} system="overview" />
      <Search />
      <main>
        <h6>Not found</h6>
      </main>
      <Footer />
    </div>
  );
}
