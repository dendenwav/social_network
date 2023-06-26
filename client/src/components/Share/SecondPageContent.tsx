import { FormControl, InputLabel, OutlinedInput } from "@mui/material";

const SecondPageContent = () => {
    return (
        <div className="desc-container">
            <FormControl className="desc-input" fullWidth color="secondary">
                <InputLabel htmlFor="desc">Description</InputLabel>
                <OutlinedInput
                    id="desc"
                    label="Description"
                    className="desc-input"
                    maxRows={23}
                    multiline
                />
            </FormControl>
        </div>
    )
}

export default SecondPageContent;