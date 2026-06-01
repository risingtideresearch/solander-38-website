import Navigation, { URLS } from "../components/Navigation/Navigation";
import Articles from "./Articles";
import { fetchStoriesPage } from "@/sanity/lib/utils";

export default async function Page() {
  const storiesPage = await fetchStoriesPage();

  return (
    <>
      <Navigation type={"top-bar"} active={URLS.STORIES} system="overview" />
      <Articles subtitles={true} description={storiesPage.data?.description} />
    </>
  );
}
