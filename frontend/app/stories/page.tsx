import Navigation, { URLS } from "../components/Navigation";
import Articles from "./Articles";

export default async function Page() {
  return (
    <>
      <Navigation type={"top-bar"} active={URLS.STORIES} section="overview" />
      <Articles subtitles={true} />
    </>
  );
}
