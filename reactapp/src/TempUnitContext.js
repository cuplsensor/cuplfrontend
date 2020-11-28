import React from "react";

const TempUnitContext = React.createContext({
    unit: "C",
    changeUnit: () => {},
});

export default TempUnitContext;