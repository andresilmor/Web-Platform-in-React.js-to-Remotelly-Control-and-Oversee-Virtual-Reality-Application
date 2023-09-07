import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function getStyles(name, optionValue, theme) {
  return {
    fontWeight:
      optionValue.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const MultipleSelectPlaceholder = ({ placeholder, options, isMultiple, selected, action = null }) => {
  const theme = useTheme();
  const [optionValue, setOptionValue] = React.useState([selected]);

  const handleChange = (event, key) => {
    const {
      target: { value },
    } = event;
    
    if (action != null)
      action(value, key["key"].replace(".1:$", ""))

    setOptionValue( 
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <>
      <FormControl sx={{ m: 1, width: "min-content" }}>
        <Select
          sx={{
            "& fieldset": { border: 'none' },
          }}
          props={{
            multiple: {isMultiple},
          }}
          displayEmpty
          value={optionValue}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>{placeholder}</em>;
            }

            return selected.join(', ');
          }}
          MenuProps={MenuProps}
          inputProps={{ 'aria-label': 'Without label',  }}
        >
          <MenuItem disabled value="" >
            <em>{placeholder}</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem
              key={option.key}
              value={option.value}
              style={getStyles(option.value, optionValue, theme)}
            >
              {option.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

export default MultipleSelectPlaceholder;