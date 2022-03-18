import { useState, useEffect } from "react";
import AddNew from "./AddNew";
import ItemsTable from "./Table";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../../firebase";

const Items = () => {
  const [itemList, setItemList] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);

  const fetch = async () => {
    const Items = await getDocs(collection(db, "items"));
    const _ItemList = Items.docs.map((doc) => doc.data());
    setItemList(_ItemList);
  };

  const fetchMaterials = async () => {
    const materials = await getDocs(collection(db, "materials"));
    const _materialsList = materials.docs.map((doc) => doc.data());
    setMaterialsList(_materialsList);
  };

  useEffect(() => {
    fetch();
    fetchMaterials();
  }, []);

  return (
    <>
      <AddNew fetch={fetch} materialsList={materialsList} />
      <ItemsTable
        itemList={itemList}
        fetch={fetch}
        fetchMaterials={fetchMaterials}
      />
    </>
  );
};

export default Items;
