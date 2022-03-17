import "./App.css";
import * as React from "react";
import { Tabs, Button, Tab, Box } from "@mui/material";
import { SnackbarProvider } from "notistack";

import Items from "./Components/Items";
import Materials from "./Components/Materials";
import Rankings from "./Components/Rankings";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const notistackRef = React.createRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      maxSnack={1}
      autoHideDuration={2000}
      ref={notistackRef}
      action={(key) => (
        <Button sx={{ color: "#fff" }} onClick={onClickDismiss(key)}>
          X
        </Button>
      )}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Items" {...a11yProps(0)} />
          <Tab label="Materials" {...a11yProps(1)} />
          <Tab label="Rankings" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Items />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Materials />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Rankings />
      </TabPanel>
    </SnackbarProvider>
  );
}

export default App;
