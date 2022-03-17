import {
  Paper,
  Box,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import { setDoc, deleteDoc, doc } from "firebase/firestore/lite";
import { db } from "../../firebase";
import { useSnackbar } from "notistack";

const ItemsTable = ({ fetch, itemList }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleRemove = async (name) => {
    try {
      await deleteDoc(doc(db, "items", name));
      enqueueSnackbar("Successfully removed!", { variant: "success" });
      fetch();
    } catch (error) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  const handleAddtoMat = async (item) => {
    try {
      await setDoc(doc(db, "materials", item.name), {
        name: item.name,
        buyPrice: item.buyPrice ? item.buyPrice : item.craftPrice,
        sellPrice: item.sellPrice,
      });
      enqueueSnackbar("Successfully removed!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  return (
    <Box sx={{ mt: "30px" }}>
      All Items:
      <TableContainer sx={{ mt: "12px" }} component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Sell Price</TableCell>
              <TableCell align="right">Buy Price</TableCell>
              <TableCell align="right">Craft Price</TableCell>
              <TableCell align="right">Profit</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemList.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.sellPrice}</TableCell>
                <TableCell align="right">{row.buyPrice}</TableCell>
                <TableCell align="right">{row.craftPrice}</TableCell>
                <TableCell align="right">
                  {row.craftPrice && `Craft: ${row.sellPrice - row.craftPrice}`}
                  {row.buyPrice && (
                    <Box>{`Buy: ${row.sellPrice - row.buyPrice}`}</Box>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Button variant="text" onClick={() => handleAddtoMat(row)}>
                    Add to Material
                  </Button>
                  <br />
                  <Button variant="text" onClick={() => handleRemove(row.name)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ItemsTable;
