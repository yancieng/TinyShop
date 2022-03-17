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
import { deleteDoc, doc } from "firebase/firestore/lite";
import { db } from "../../firebase";
import { useSnackbar } from "notistack";

const MaterialsTable = ({ fetch, materialsList }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleRemove = async (name) => {
    try {
      await deleteDoc(doc(db, "materials", name));
      enqueueSnackbar("Successfully removed!", { variant: "success" });
      fetch();
    } catch (error) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  return (
    <Box sx={{ mt: "30px" }}>
      All Materials:
      <TableContainer sx={{ mt: "12px" }} component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Sell Price</TableCell>
              <TableCell align="right">Buy Price</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materialsList.reverse().map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.sellPrice}</TableCell>
                <TableCell align="right">{row.buyPrice}</TableCell>
                <TableCell align="right">
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

export default MaterialsTable;
