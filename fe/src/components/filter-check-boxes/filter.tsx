import React from "react";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

type FilterCheckboxesProps = {
    activeFilter: "following" | "notStarted" | "occurring" | null;
    onFilterChange: (filter: "following" | "notStarted" | "occurring" | null) => void;
};

const FilterCheckboxes: React.FC<FilterCheckboxesProps> = ({ activeFilter, onFilterChange }) => {
    const handleFilterChange = (filter: "following" | "notStarted" | "occurring") => {
        // Toggle the active filter; deselect if it's already active
        onFilterChange(activeFilter === filter ? null : filter);
    };

    return (
        <FormGroup row style={{ justifyContent: "center", marginBottom: "16px" }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={activeFilter === "following"}
                        onChange={() => handleFilterChange("following")}
                    />
                }
                label="Show Following"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={activeFilter === "notStarted"}
                        onChange={() => handleFilterChange("notStarted")}
                    />
                }
                label="Show Not Started"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={activeFilter === "occurring"}
                        onChange={() => handleFilterChange("occurring")}
                    />
                }
                label="Show Occurring"
            />
        </FormGroup>
    );
};

export default FilterCheckboxes;
