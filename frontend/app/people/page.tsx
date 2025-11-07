import { fetchPeople } from "@/sanity/lib/utils";

export default async function Page() {
  const people = await fetchPeople();
  console.log(people)

  return (
    <div>
      {/* <TableOfContents
        sections={sections?.data.sections || []}
        modes={["system", "material"]}
        materials={materials_index.unique_materials}
      > */}
      <main style={{paddingLeft: '16.5rem'}}>
        {people.data.sort((a,b) => a.name.localeCompare(b.name)).map(person => {
          return (
            <div key={person._id}>
              {person.name}
            </div>
          )
        })}
      </main>
      {/* </TableOfContents> */}
    </div>
  );
}
