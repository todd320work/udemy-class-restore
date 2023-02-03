import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
    items: any[];
    itemsSelected: string[] | undefined;
    onChange: (items: string[]) => void;
}


export default function CheckBoxList({items, itemsSelected, onChange}: Props) {
    const [checkedItems, setCheckedItems] = useState(itemsSelected || []);

    function handleChecked(value: string)
    {
        const currentIndex = checkedItems.findIndex( item => item === value);
        let newChecked: string[] = [];
        if( currentIndex === -1 ) {
            newChecked = [...checkedItems, value];
        }
        else {
            newChecked = checkedItems.filter(item => item !== value);
        }
        
        setCheckedItems(newChecked);
        onChange(newChecked);
    }

    return (
        <FormGroup>
        {
            items.map( (item: any) => 
                <FormControlLabel 
                    checked={checkedItems.indexOf(item) !== -1} 
                    control={<Checkbox />} 
                    label={item} key={item} 
                    onClick={() => handleChecked(item)}
                    />
                    )
        }
        </FormGroup>
    )              
}