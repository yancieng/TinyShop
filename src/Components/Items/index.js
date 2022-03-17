import { useState, useEffect } from "react";
import AddNew from "./AddNew";
import ItemsTable from "./Table";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../../firebase";

const Items = () => {
  const [itemList, setItemList] = useState([]);

  const fetch = async () => {
    const Items = await getDocs(collection(db, "items"));
    const _ItemList = Items.docs.map((doc) => doc.data());
    setItemList(_ItemList);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <AddNew fetch={fetch} />
      <ItemsTable itemList={itemList} fetch={fetch} />
    </>
  );
};

export default Items;
