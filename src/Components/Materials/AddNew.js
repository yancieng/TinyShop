import { useState } from "react";
import { Box, Button, TextField, Alert, AlertTitle } from "@mui/material";
import { setDoc, doc } from "firebase/firestore/lite";
import { db } from "../../firebase";
import { useSnackbar } from "notistack";

const defaultValue = {
  name: "",
  sellAmount: 1,
  sellPrice: 0,
  buyPrice: 0,
  buyAmount: 1,
};

const AddNew = ({ fetch }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    if (!validate(e)) return;

    const _value = { ...value };
    _value[e.target.name] = e.target.value;
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

  const handleSubmit = async () => {
    try {
      await setDoc(doc(db, "materials", value.name), {
        name: value.name,
        buyPrice: value.buyPrice / value.buyAmount || 0,
        sellPrice: value.sellPrice / value.sellAmount || 0,
      });
      fetch();
      setValue(defaultValue);
      enqueueSnackbar("Successfully added!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  return (
    <Box>
      <Box sx={{ fontSize: "20px", mb: "12px" }}>Add New Materials</Box>
      <TextField
        sx={{ mb: "12px" }}
        onChange={handleChange}
        label="Name"
        name="name"
        value={value.name}
        variant="outlined"
      />
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
        <br /> = {value.buyPrice / value.buyAmount} Each
      </Alert>
      <Alert variant="outlined" severity="info">
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
      <Button
        sx={{ mt: "12px" }}
        variant="contained"
        disabled={
          value.name === "" || (value.sellPrice < 1 && value.buyPrice < 1)
        }
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
};

export default AddNew;
