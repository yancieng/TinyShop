import { useState, useEffect } from "react";
import AddNew from "./AddNew";
import MaterialsTable from "./Table";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../../firebase";

const Materials = () => {
  const [materialList, setMaterialList] = useState([]);
  const fetch = async () => {
    const materials = await getDocs(collection(db, "materials"));
    const _materialList = materials.docs.map((doc) => doc.data());
    setMaterialList(_materialList);
  };

  useEffect(() => {
    fetch();
  }, []);
  return (
    <>
      <AddNew fetch={fetch} />
      <MaterialsTable materialList={materialList} fetch={fetch} />
    </>
  );
};

export default Materials;
