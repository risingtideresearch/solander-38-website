import { fetchPeople } from "@/sanity/lib/utils";

export default async function Page() {
  const people = await fetchPeople();
  const split = people.data.map((person) => {
    const [first, last] = person.name.split(" ");

    return {
      ...person,
      first,
      last,
    };
  });

  return (
    <div>
      {/* <TableOfContents
        sections={sections?.data.sections || []}
        modes={["system", "material"]}
        materials={materials_index.unique_materials}
      > */}
      <main style={{ paddingLeft: "16.5rem" }}>
        {split
          .sort((a, b) => a.last.localeCompare(b.last))
          .map((person) => {
            return (
              <div key={person._id}>
                {person.last}, {person.first}
              </div>
            );
          })}
      </main>
      {/* </TableOfContents> */}
    </div>
  );
}
