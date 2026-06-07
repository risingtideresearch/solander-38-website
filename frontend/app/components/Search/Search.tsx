import SearchClient from "./SearchClient";

export default function Search({ type = '' }) {
  return <SearchClient type={type} />;
}
