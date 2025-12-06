import styles from "./materialTable.module.scss";

export default async function MaterialTable({ materials }) {
  return (
    <div>
      <div className={`${styles.materials}`}>

      <h6 style={{ gridColumn: 'span 2', fontWeight: 600, border: 'none', borderBottom: '1px solid #eeeeee'}}>Materials</h6>
        <div>
          {materials
            .sort((a, b) => a.localeCompare(b))
            .map((material, i, x) => {
              return (
                <h6
                  key={material}
                  style={
                    (i % 2 == 0 && i < x.length - 2) ||
                    (i % 2 == 1 && i < x.length - 1)
                      ? {
                          borderBottom: "1px solid #eeeeee",
                        }
                      : {}
                  }
                >
                  {material}
                </h6>
              );
            })}
        </div>
      </div>
    </div>
  );
}
