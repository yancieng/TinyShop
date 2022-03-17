import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Alert,
  AlertTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { collection, getDocs, setDoc, doc } from "firebase/firestore/lite";
import { db } from "../../firebase";
import { useSnackbar } from "notistack";

const defaultValue = {
  name: "",
  sellAmount: 1,
  sellPrice: 0,
  buyPrice: 0,
  buyAmount: 1,
  craft: [{ name: "", amount: 1 }],
  craftAmount: 1,
};

const AddNew = ({ fetch }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [materialsList, setMaterialsList] = useState([]);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const fetchMaterials = async () => {
      const materials = await getDocs(collection(db, "materials"));
      const _materialsList = materials.docs.map((doc) => doc.data());
      setMaterialsList(_materialsList);
    };

    fetchMaterials();
  }, []);

  const handleChange = (e) => {
    if (!validate(e)) return;

    const _value = { ...value };
    _value[e.target.name] = e.target.value;
    setValue(_value);
  };

  const handleChangeCraft = (e, index) => {
    if (!validate(e)) return;

    const _value = JSON.parse(JSON.stringify(value));
    _value.craft[index][e.target.name] = e.target.value;
    setValue(_value);
  };

  const handleAddMore = () => {
    const _value = { ...value };
    _value.craft.push({ name: "", amount: 1 });
    setValue(_value);
  };

  const handleRemove = (index) => {
    const _value = { ...value };
    _value.craft.splice(index, 1);
    setValue(_value);
  };

  const validate = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      return value.match(/^[a-zA-Z ]*$/);
    } else {
      return value.match(/^[0-9]*$/);
    }
  };

  const calculateCraftingCost = () => {
    let totalCost = 0;
    if (value.craft[0].name !== "") {
      value.craft.forEach((row) => {
        const material = materialsList.find((item) => item.name === row.name);
        if (material.buyPrice !== 0) {
          totalCost = totalCost + material.buyPrice * row.amount;
        } else {
          totalCost = totalCost + material.sellPrice * row.amount;
        }
      });
    }
    return totalCost / value.craftAmount;
  };

  const handleSubmit = async () => {
    try {
      let _value = {
        name: value.name,
        sellPrice: value.sellPrice / value.sellAmount || 0,
      };
      if (value.buyPrice > 0)
        _value.buyPrice = value.buyPrice / value.buyAmount;

      const craftingCost = calculateCraftingCost();
      if (craftingCost !== 0) _value.craftPrice = craftingCost;

      await setDoc(doc(db, "items", _value.name), _value);
      fetch();
      console.log(defaultValue);
      setValue(defaultValue);
      enqueueSnackbar(
        `Success. Profit - ${
          _value.craftPrice
            ? " Craft: " +
              (_value.sellPrice - _value.craftPrice).toString() +
              ", "
            : ""
        }  ${
          _value.buyPrice
            ? "Buy: " + (_value.sellPrice - _value.buyPrice).toString()
            : ""
        }`,
        { variant: "success", persist: true }
      );
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  return (
    <Box>
      <Box sx={{ fontSize: "20px", mb: "12px" }}>Add New Item</Box>
      <TextField
        sx={{ mb: "12px" }}
        onChange={handleChange}
        label="Name"
        name="name"
        value={value.name}
        variant="outlined"
      />
      <Alert variant="outlined" severity="info" sx={{ mb: "12px" }}>
        <AlertTitle>Sell</AlertTitle>
        <TextField
          sx={{ mr: "12px", mb: "12px" }}
          onChange={handleChange}
          label="Amount"
          name="sellAmount"
          value={value.sellAmount}
          variant="outlined"
        />
        <TextField
          sx={{ mb: "12px" }}
          onChange={handleChange}
          label="Price"
          name="sellPrice"
          value={value.sellPrice}
          variant="outlined"
        />
        <br />= {value.sellPrice / value.sellAmount} Each
      </Alert>
      <Alert variant="outlined" severity="info" sx={{ mb: "12px" }}>
        <AlertTitle>Buy</AlertTitle>
        <TextField
          sx={{ mr: "12px", mb: "12px" }}
          onChange={handleChange}
          label="Amount"
          name="buyAmount"
          value={value.buyAmount}
          variant="outlined"
        />
        <TextField
          sx={{ mb: "12px" }}
          onChange={handleChange}
          label="Price"
          name="buyPrice"
          value={value.buyPrice}
          variant="outlined"
        />
        <br />= {value.buyPrice / value.buyAmount} Each
      </Alert>

      <Alert variant="outlined" severity="info" sx={{ mb: "12px" }}>
        <AlertTitle>Crafting</AlertTitle>
        <TextField
          sx={{ mb: "12px" }}
          onChange={handleChange}
          label="Amount"
          name="craftAmount"
          value={value.craftAmount}
          variant="outlined"
        />
        {value.craft.map((row, index) => {
          return (
            <Box key={index} sx={{ mb: "12px" }}>
              <FormControl sx={{ width: "200px", mr: "12px", mb: "12px" }}>
                <InputLabel id={`select-label-${index}`}>Name</InputLabel>
                <Select
                  labelId={`select-label-${index}`}
                  value={row.name}
                  label="Name"
                  name="name"
                  onChange={(e) => handleChangeCraft(e, index)}
                >
                  <MenuItem value=""></MenuItem>
                  {materialsList.map((materials, i) => (
                    <MenuItem key={i} value={materials.name}>
                      {materials.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                sx={{ mr: "12px", mb: "12px" }}
                onChange={(e) => handleChangeCraft(e, index)}
                label="Amount"
                name="amount"
                value={row.amount}
                variant="outlined"
              />
              {index !== 0 && (
                <Button variant="text" onClick={() => handleRemove(index)}>
                  Remove
                </Button>
              )}
            </Box>
          );
        })}
        <Button sx={{ mt: "12px" }} variant="text" onClick={handleAddMore}>
          Add more
        </Button>
      </Alert>

      <Button
        sx={{ mt: "12px" }}
        variant="contained"
        disabled={
          value.name === "" ||
          value.sellPrice < 1 ||
          (value.craft[0].name === "" && value.buyPrice < 1)
        }
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AddNew;
