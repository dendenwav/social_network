import { IconButton, TextField, Autocomplete, InputAdornment } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';

import { getUsers } from "../../actions/usersActions";
import * as UsersInterfaces from "../../../../server/src/models/_interfaces/UsersInterfaces";

export default function SearchBar() {    
    const [users, setUsers] = useState<UsersInterfaces.IUser[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showClear, setShowClear] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let result;
        async function GetUsersFunc() {
            result = await getUsers();
            result.forEach((user: UsersInterfaces.IUser) => {
                if (!users.some((u: UsersInterfaces.IUser) => u.pseudo === user.pseudo)) setUsers((users) => [...users, { pseudo: user.pseudo }]);
            });
        }
        GetUsersFunc();
    }, [users]);

    const clearSearchInput = () => {
        setInputValue('');
        setShowClear(false);
    }
    
    const handleChange = async (e: React.SyntheticEvent, newValue: string | null) => {
        console.log("handleChange");
        if (newValue) {
            setInputValue(newValue);
            tryResearch(newValue);
        }
    }
    
    const handleInputChange = (e: React.SyntheticEvent, newInputValue: string) => {
        console.log(`inputValue: {${newInputValue}}`);
        setInputValue(newInputValue);
        if (newInputValue.length > 0) setShowClear(true);
        else setShowClear(false);
    }
    
    const onSearchButtonClick = () => {
        tryResearch(inputValue);
    }

    const tryResearch = (userToResearch: string) => {
        if (userToResearch.length > 0 && users.some((user: UsersInterfaces.IUser) => user.pseudo === userToResearch)) navigate(`/profile/${userToResearch}`);
        else console.log("no user found");
    }
    
    return (
        <Autocomplete
            freeSolo
            id="filter-demo"
            autoHighlight
            value={inputValue}
            inputValue={inputValue}
            onChange={handleChange}
            onInputChange={handleInputChange}
            color="secondary"
            onFocus={() => {if (inputValue.length > 0) setShowClear(true)}}
            onBlur={() => {setShowClear(false);}}
            disableClearable
            size='small'
            options={users.map((user) => user.pseudo)}
            renderInput={(params) => 
                <TextField
                    {...params}
                    color="secondary"
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton onClick={onSearchButtonClick}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                {showClear ? 
                                    <IconButton onClick={clearSearchInput}>
                                        <ClearIcon/>
                                    </IconButton>
                                : null}
                            </InputAdornment>
                        ),
                    }}
                />
            }
        />
    );
}